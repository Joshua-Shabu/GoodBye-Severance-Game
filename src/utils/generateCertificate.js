import { jsPDF } from "jspdf";

const generateCertificate = (name) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Add a border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.rect(10, 10, 190, 277);

  // Title
  doc.setFont("times", "bold");
  doc.setFontSize(30);
  doc.text("CERTIFICATE", 105, 50, null, null, "center");

  doc.setFontSize(18);
  doc.setFont("times", "italic");
  doc.text("OF APPRECIATION", 105, 65, null, null, "center");

  // Recipient Name
  doc.setFontSize(22);
  doc.setFont("times", "bolditalic");
  doc.text(`This certificate is proudly awarded to`, 105, 90, null, null, "center");

  doc.setFont("times", "italic");
  doc.setFontSize(26);
  doc.text(name, 105, 110, null, null, "center");

  // Description
  doc.setFontSize(14);
  doc.setFont("times", "normal");
  doc.text(
    `for winning this game, and successfully working with me!`,
    105,
    130,
    { align: "center", maxWidth: 180 }
  );
  doc.text("NB: There will not be any cash prize!", 105, 145, null, null, "center");

  // Thank you message and date
  doc.setFont("times", "italic");
  doc.text("Thank you, Joshua", 20, 160);
  const currentDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
  doc.text(currentDate, 190, 160, null, null, "right");

  // Save PDF
  doc.save("CThanksByJoshua.pdf");
};

export default generateCertificate;
