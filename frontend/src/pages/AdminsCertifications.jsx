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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            Certification Requests
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Review and manage therapist certification applications
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-[#C05299] to-pink-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-500">
              {certs.length} pending {certs.length === 1 ? 'request' : 'requests'}
            </span>
          </div>
        </div>

        {/* Certifications Grid */}
        {certs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#C05299]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">All caught up!</h3>
            <p className="text-gray-600">No pending certification requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* User Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#C05299] to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-lg sm:text-xl font-bold">
                            {cert.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
                            {cert.username}
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base truncate">{cert.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                          {cert.status}
                        </span>
                        <a
                          href={cert.file_path}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-[#C05299] hover:text-pink-700 font-medium text-sm transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Certificate
                        </a>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-row gap-3 lg:flex-col lg:w-auto">
                      <button
                        onClick={() => handleDecision(cert.id, "approved")}
                        className="flex-1 sm:flex-initial lg:w-32 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision(cert.id, "rejected")}
                        className="flex-1 sm:flex-initial lg:w-32 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}