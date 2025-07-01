export function showToast(message: string, type: "success" | "error" = "success") {
    const container = document.getElementById("global-toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `alert ${type === "success" ? "alert-success" : "alert-error"} shadow-lg text-sm mb-2`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
