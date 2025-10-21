import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { showAlert, handleError } from "../utils/alertUtils";

export default function AdminCertifications() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await axiosInstance.get("/api/admin/certifications");
        setCerts(res.data);
      } catch (err) {
        console.error("Error fetching certifications:", err.response?.data || err.message);
        handleError(err);
      }
    };
    fetchCerts();
  }, []);

  const handleDecision = async (id, status) => {
    try {
      await axiosInstance.put(`/api/admin/certifications/${id}`, { status });
      setCerts((prev) => prev.filter((c) => c.id !== id));
      showAlert(`Certification ${status}`);
    } catch (err) {
      console.error("Error updating certification:", err.response?.data || err.message);
      handleError(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Therapist Certification Requests</h1>
      {certs.map((cert) => (
        <div key={cert.id} className="border p-4 rounded-lg shadow mb-4 flex justify-between items-center">
          <div>
            <p><strong>User:</strong> {cert.username} ({cert.email})</p>
            <p><strong>Status:</strong> {cert.status}</p>
            <a
              href={cert.file_path}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              View Certification
            </a>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => handleDecision(cert.id, "approved")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleDecision(cert.id, "rejected")}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
