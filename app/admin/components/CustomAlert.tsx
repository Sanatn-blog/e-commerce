"use client";

import { useEffect } from "react";
import { X, AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";

interface CustomAlertProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    type?: "success" | "error" | "warning" | "info" | "confirm";
    confirmText?: string;
    cancelText?: string;
}

export default function CustomAlert({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = "info",
    confirmText = "OK",
    cancelText = "Cancel",
}: CustomAlertProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-12 h-12 text-green-500" />;
            case "error":
                return <XCircle className="w-12 h-12 text-red-500" />;
            case "warning":
            case "confirm":
                return <AlertCircle className="w-12 h-12 text-yellow-500" />;
            default:
                return <Info className="w-12 h-12 text-blue-500" />;
        }
    };

    const getColorClasses = () => {
        switch (type) {
            case "success":
                return "border-green-200 bg-green-50";
            case "error":
                return "border-red-200 bg-red-50";
            case "warning":
            case "confirm":
                return "border-yellow-200 bg-yellow-50";
            default:
                return "border-blue-200 bg-blue-50";
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Alert Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-6">
                    {/* Icon */}
                    <div className={`flex justify-center mb-4 p-4 rounded-full ${getColorClasses()} border-2 w-fit mx-auto`}>
                        {getIcon()}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 text-center mb-6 whitespace-pre-line">
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        {type === "confirm" && onConfirm ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    {confirmText}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                {confirmText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
