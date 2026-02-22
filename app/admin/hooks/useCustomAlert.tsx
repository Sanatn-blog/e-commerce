"use client";

import { useState, useCallback } from "react";

interface AlertConfig {
    title: string;
    message: string;
    type?: "success" | "error" | "warning" | "info" | "confirm";
    confirmText?: string;
    cancelText?: string;
}

export function useCustomAlert() {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<AlertConfig>({
        title: "",
        message: "",
        type: "info",
    });
    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

    const showAlert = useCallback((alertConfig: AlertConfig) => {
        setConfig(alertConfig);
        setIsOpen(true);
        setOnConfirmCallback(null);
    }, []);

    const showConfirm = useCallback((alertConfig: AlertConfig, onConfirm: () => void) => {
        setConfig({ ...alertConfig, type: "confirm" });
        setIsOpen(true);
        setOnConfirmCallback(() => onConfirm);
    }, []);

    const closeAlert = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleConfirm = useCallback(() => {
        if (onConfirmCallback) {
            onConfirmCallback();
        }
    }, [onConfirmCallback]);

    return {
        isOpen,
        config,
        showAlert,
        showConfirm,
        closeAlert,
        handleConfirm,
    };
}
