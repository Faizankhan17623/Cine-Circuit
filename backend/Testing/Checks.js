
const btns = document.querySelector("button"); // Select all buttons with class 'btn'
function generatePDF() {
    const { jsPDF } = window.jspdf;
    // console.log("Button clicked!",jsPDF); // Log to console for debugging
    const doc = new jsPDF();       
    console.log("jsPDF instance created",doc); // Log to console for debugging
    doc.text("Hello, this is a PDF generated with jsPDF!", 100, 100);  

    doc.save("sample.pdf");
}



btns.addEventListener("click", ()=>{
    console.log("Button clicked!"); // Log to console for debugging
    generatePDF(); // Call the function to generate PDF on button click
}); // Add click event listener to the button