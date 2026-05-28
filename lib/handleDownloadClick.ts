// Given a URL, this will generate a link to download the file and auto click it.
export const handleDownloadClick = async (url: string) => {
  // Method 1
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = objUrl;
    link.download = `${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    // If method 1 fails, this will work...
    const link = document.createElement("a");
    link.href = url;
    link.download = `${Date.now()}.pdf`;
    link.rel = "noopener noreferrer";
    link.target = "_blank";
    link.style.display = "none";

    // Open the link in a new tab and focus it.
    window.open(link.href, link.target);
    window.focus();
  }
};
