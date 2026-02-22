"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import CustomAlert from "../components/CustomAlert";
import { useCustomAlert } from "../hooks/useCustomAlert";

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
  updatedAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { isOpen, config, showConfirm, closeAlert, handleConfirm } = useCustomAlert();

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const url =
        filter === "all"
          ? "/api/admin/contacts"
          : `/api/admin/contacts?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchContacts();
        if (selectedContact?._id === id) {
          setSelectedContact({ ...selectedContact, status } as Contact);
        }
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const deleteContact = async (id: string) => {
    showConfirm(
      {
        title: "Delete Contact",
        message: "Are you sure you want to delete this contact? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
      async () => {
        try {
          const res = await fetch(`/api/admin/contacts/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            fetchContacts();
            if (selectedContact?._id === id) {
              setSelectedContact(null);
            }
          }
        } catch (error) {
          console.error("Error deleting contact:", error);
        }
      }
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      new: "bg-blue-100 text-blue-800",
      read: "bg-yellow-100 text-yellow-800",
      replied: "bg-green-100 text-green-800",
    };
    return styles[status as keyof typeof styles] || styles.new;
  };

  return (
    <>
      <CustomAlert
        isOpen={isOpen}
        onClose={closeAlert}
        onConfirm={handleConfirm}
        title={config.title}
        message={config.message}
        type={config.type}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
      />
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Contact Messages
              </h1>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2">
              {["all", "new", "read", "replied"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md capitalize ${filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-gray-900 text-xl font-semibold mb-4">
                    Messages ({contacts.length})
                  </h2>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {contacts.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No messages found
                      </p>
                    ) : (
                      contacts.map((contact) => (
                        <div
                          key={contact._id}
                          onClick={() => setSelectedContact(contact)}
                          className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedContact?._id === contact._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                            }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {contact.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(
                                contact.status
                              )}`}
                            >
                              {contact.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {contact.email}
                          </p>
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            {contact.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(contact.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  {selectedContact ? (
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h2 className=" text-gray-950 text-xl font-semibold">
                          Message Details
                        </h2>
                        <button
                          onClick={() => deleteContact(selectedContact._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <p className="text-gray-900">{selectedContact.name}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <p className="text-gray-900">{selectedContact.email}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Subject
                          </label>
                          <p className="text-gray-900">
                            {selectedContact.subject}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Message
                          </label>
                          <p className="text-gray-900 whitespace-pre-wrap">
                            {selectedContact.message}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <select
                            value={selectedContact.status}
                            onChange={(e) =>
                              updateStatus(selectedContact._id, e.target.value)
                            }
                            className="text-gray-950 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Received
                          </label>
                          <p className="text-gray-900">
                            {new Date(selectedContact.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Select a message to view details
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
