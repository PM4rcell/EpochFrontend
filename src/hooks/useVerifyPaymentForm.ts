import { useState } from "react";

export type PaymentField = "name" | "cardNumber" | "expiry" | "cvc" | "email" | "country" | "zip";

export interface PaymentFormData {
  name: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  email: string;
  country: string;
  zip: string;
}

interface UseVerifyPaymentFormOptions {
  showEmailField?: boolean;
  onPay?: () => void;
}

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const formatCvc = (value: string) => value.replace(/\D/g, "").slice(0, 4);

const getExpiryError = (value: string) => {
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return "Use MM/YY format";
  }

  const [monthText, yearText] = value.split("/");
  const month = Number(monthText);
  if (month < 1 || month > 12) {
    return "Enter a valid month";
  }

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  const year = Number(yearText);

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "Card has expired";
  }

  return "";
};

const getZipError = (value: string) => {
  if (!/^[A-Za-z0-9\s-]{3,10}$/.test(value.trim())) {
    return "Enter a valid postal code";
  }

  return "";
};

export function useVerifyPaymentForm({ showEmailField = false, onPay }: UseVerifyPaymentFormOptions) {
  const [formData, setFormData] = useState<PaymentFormData>({
    name: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    email: "",
    country: "",
    zip: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const validateField = (field: PaymentField, value: string) => {
    switch (field) {
      case "email":
        if (!showEmailField) return "";
        if (!value.trim()) return "Email is required";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Enter a valid email";
      case "name":
        if (!value.trim()) return "Name is required";
        return value.trim().length >= 2 ? "" : "Enter the cardholder name";
      case "cardNumber":
        if (!value.trim()) return "Card number is required";
        return value.replace(/\D/g, "").length === 16 ? "" : "Enter a valid card number";
      case "expiry":
        if (!value.trim()) return "Expiry date is required";
        return getExpiryError(value);
      case "cvc":
        if (!value.trim()) return "CVC is required";
        return /^\d{3,4}$/.test(value) ? "" : "Enter a valid CVC";
      case "country":
        if (!value.trim()) return "Country is required";
        return value.trim().length >= 2 ? "" : "Enter a valid country";
      case "zip":
        if (!value.trim()) return "ZIP code is required";
        return getZipError(value);
      default:
        return "";
    }
  };

  const getFormattedValue = (field: string, value: string) => {
    switch (field) {
      case "cardNumber":
        return formatCardNumber(value);
      case "expiry":
        return formatExpiry(value);
      case "cvc":
        return formatCvc(value);
      default:
        return value;
    }
  };

  const getValidationErrors = (data = formData) => {
    const nextErrors: Record<string, string> = {};
    const requiredFields: PaymentField[] = ["name", "cardNumber", "expiry", "cvc", "country", "zip"];

    if (showEmailField) {
      requiredFields.unshift("email");
    }

    requiredFields.forEach((field) => {
      const error = validateField(field, data[field]);
      if (error) {
        nextErrors[field] = error;
      }
    });

    return nextErrors;
  };

  const isFormValid = Object.keys(getValidationErrors()).length === 0;

  const handleChange = (field: keyof PaymentFormData, value: string) => {
    const nextValue = getFormattedValue(field, value);
    const nextFormData = { ...formData, [field]: nextValue };

    setFormData(nextFormData);

    if (touchedFields[field]) {
      setErrors({
        ...errors,
        [field]: validateField(field as PaymentField, nextValue),
      });
    } else if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleBlur = (field: PaymentField) => {
    setTouchedFields({ ...touchedFields, [field]: true });
    setErrors({
      ...errors,
      [field]: validateField(field, formData[field]),
    });
  };

  const handlePayClick = () => {
    const nextErrors = getValidationErrors();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setTouchedFields({
        name: true,
        cardNumber: true,
        expiry: true,
        cvc: true,
        email: showEmailField,
        country: true,
        zip: true,
      });
      return;
    }

    onPay?.();
  };

  return {
    formData,
    errors,
    isFormValid,
    handleChange,
    handleBlur,
    handlePayClick,
  } as const;
}