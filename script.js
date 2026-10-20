const photoSlots = [
  ...document.querySelectorAll(".photo-main img, .photo-small img, .card-image img"),
];

photoSlots.forEach((image, index) => {
  const savedImage = localStorage.getItem(`memory-photo-${index}`);
  if (savedImage) image.src = savedImage;

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

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const uploadedImage = new Image();
      uploadedImage.addEventListener("load", () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 1400 / Math.max(uploadedImage.width, uploadedImage.height));
        canvas.width = Math.round(uploadedImage.width * scale);
        canvas.height = Math.round(uploadedImage.height * scale);
        canvas.getContext("2d").drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
        const compressedImage = canvas.toDataURL("image/jpeg", 0.82);
        image.src = compressedImage;
        try {
          localStorage.setItem(`memory-photo-${index}`, compressedImage);
        } catch {
          alert("Penyimpanan browser penuh. Coba foto yang ukurannya lebih kecil.");
        }
      });
      uploadedImage.src = reader.result;
    });
    reader.readAsDataURL(file);
  });

  container.append(input, button);
});
