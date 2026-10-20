const photoSlots = [
  ...document.querySelectorAll(".photo-main img, .photo-small img, .card-image img"),
];

photoSlots.forEach((image, index) => {
  try {
    const savedImage = localStorage.getItem(`memory-photo-${index}`);
    if (savedImage) image.src = savedImage;
  } catch {}

  const container = image.closest(".photo-main, .photo-small, .card-image");
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.hidden = true;
  input.setAttribute("aria-label", "Pilih foto pengganti");

  const button = document.createElement("button");
  button.type = "button";
  button.className = "photo-edit";
  button.textContent = "Ganti foto";
  button.setAttribute("aria-label", `Ganti foto ${index + 1}`);
  button.addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Pilih file gambar seperti JPG, PNG, atau WebP.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    image.src = imageUrl;
    const uploadedImage = new Image();
    uploadedImage.addEventListener("load", () => {
      try {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 1400 / Math.max(uploadedImage.width, uploadedImage.height));
        canvas.width = Math.round(uploadedImage.width * scale);
        canvas.height = Math.round(uploadedImage.height * scale);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas tidak tersedia");
        context.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
        const compressedImage = canvas.toDataURL("image/jpeg", 0.82);
        image.src = compressedImage;
        URL.revokeObjectURL(imageUrl);
        try {
          localStorage.setItem(`memory-photo-${index}`, compressedImage);
        } catch {
          alert("Foto berhasil diganti, tetapi browser tidak mengizinkan penyimpanan. Foto perlu dipilih lagi saat halaman dibuka ulang.");
        }
      } catch {
        alert("Foto berhasil ditampilkan, tetapi tidak bisa disimpan untuk kunjungan berikutnya.");
      }
    });
    uploadedImage.addEventListener("error", () => {
      URL.revokeObjectURL(imageUrl);
      alert("Foto ini tidak bisa dibuka. Coba simpan sebagai JPG atau PNG, lalu pilih lagi.");
    });
    uploadedImage.src = imageUrl;
  });

  container.append(input, button);
});
