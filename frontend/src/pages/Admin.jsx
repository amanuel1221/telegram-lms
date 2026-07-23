import React from "react";
import AdminUpload from "../components/AdminUpload";

export default function Admin({ onUploadSuccess }) {
  return (
    <div className="space-y-4">
      <AdminUpload onUploadSuccess={onUploadSuccess} />
    </div>
  );
}