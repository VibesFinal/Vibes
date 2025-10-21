// frontend/src/utils/alertUtils.js
import { errorMapper } from "./errorMapper";

// Custom alert box with transparent soft design
export function showAlert(message, type = "info") {
  const colors = {
    success: "text-green-700 bg-green-100 border-green-300",
    error: "text-red-700 bg-red-100 border-red-300",
    warning: "text-yellow-700 bg-yellow-100 border-yellow-300",
    info: "text-purple-700 bg-purple-100 border-purple-300",
  };

  const oldAlert = document.getElementById("custom-alert");
  if (oldAlert) oldAlert.remove();

  // Alert container
  const alertBox = document.createElement("div");
  alertBox.id = "custom-alert";
  alertBox.innerHTML = `
    <div class="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
      <!-- Transparent blurred background -->
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      
      <!-- Alert card -->
      <div class="relative z-10 w-[90%] max-w-md bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-8 text-center flex flex-col items-center">
        
        <!-- Gradient blob background -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-0 -left-4 w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div class="absolute -bottom-8 right-0 w-60 h-60 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <!-- Alert content -->
        <div class="relative z-10">
          <!-- <span class="${colors[type]} border px-4 py-1 rounded-full text-sm font-medium capitalize mb-4 inline-block">
            ${type}
          </span> -->
          <p class="text-gray-800 text-lg font-medium mb-6">${message}</p>
          <button class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-200">OK</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(alertBox);

  // Close on button click
  alertBox.querySelector("button").addEventListener("click", () => {
    alertBox.remove();
  });
}

// Unified error handler
export function handleError(error) {
  console.group("⚠️ Error details:");

  let userMessage = "Something went wrong. Please try again.";
  let type = "error";

  if (error.response?.data) {
    const data = error.response.data;
    const originalMessage = data.message || data.error || error.message || "An unexpected error occurred.";
    userMessage = errorMapper[originalMessage] || originalMessage;
    type = data.type || "error"; // use backend type if provided
    console.log("Server Response:", data);
  } else if (error.message?.includes("Network")) {
    userMessage = "Network issue. Please check your internet connection.";
  } else {
    userMessage = error.message || userMessage;
  }

  showAlert(userMessage, type);
  console.error("Error:", error);
  console.groupEnd();
}

export function showConfirm(message, onConfirm, onCancel) {
  const oldAlert = document.getElementById("custom-alert");
  if (oldAlert) oldAlert.remove();

  const alertBox = document.createElement("div");
  alertBox.id = "custom-alert";
  alertBox.innerHTML = `
    <div class="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div class="relative z-10 w-[90%] max-w-md bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-8 text-center flex flex-col items-center">
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-0 -left-4 w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div class="absolute -bottom-8 right-0 w-60 h-60 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        <div class="relative z-10">
          <p class="text-gray-800 text-lg font-medium mb-6">${message}</p>
          <div class="flex gap-4 justify-center">
            <button id="confirm-yes" class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-200">Yes</button>
            <button id="confirm-no" class="bg-white/70 hover:bg-white/90 text-purple-700 px-5 py-2 rounded-lg shadow-md transition duration-200 border border-purple-300">No</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(alertBox);

  alertBox.querySelector("#confirm-yes").addEventListener("click", () => {
    alertBox.remove();
    if (onConfirm) onConfirm();
  });

  alertBox.querySelector("#confirm-no").addEventListener("click", () => {
    alertBox.remove();
    if (onCancel) onCancel();
  });
}



