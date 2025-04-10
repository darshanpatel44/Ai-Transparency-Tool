import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// AI Tool option mappings
const aiToolOptions = [
  { value: 'chatgpt', label: 'ChatGPT (OpenAI)' },
  { value: 'gemini', label: 'Gemini (Google)' },
  { value: 'claude', label: 'Claude (Anthropic)' },
  { value: 'llama', label: 'Llama (Meta)' },
  { value: 'dalle', label: 'DALL·E (OpenAI)' },
  { value: 'midjourney', label: 'MidJourney' },
  { value: 'copilot', label: 'GitHub Copilot' },
  { value: 'bard', label: 'Bard (Google)' },
  { value: 'other', label: 'Other' }
];

const aiTypeOptions = [
  { value: 'text-generation', label: 'Text Generation' },
  { value: 'code-generation', label: 'Code Generation' },
  { value: 'image-synthesis', label: 'Image Synthesis' },
  { value: 'music-generation', label: 'Music Synthesis' },
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'video-generation', label: 'Video Synthesis' },
  { value: 'speech-synthesis', label: 'Speech Synthesis' },
  { value: 'other', label: 'Other' }
];

const purposeOptions = [
  { value: 'writer_block', label: 'To get started or overcome writer\'s block' },
  { value: 'first_draft', label: 'To generate a first draft or outline' },
  { value: 'improve_grammar', label: 'To improve grammar, clarity, or tone' },
  { value: 'explore_ideas', label: 'To explore multiple perspectives or ideas' },
  { value: 'paraphrase', label: 'To paraphrase or rephrase my own writing' },
  { value: 'summarize', label: 'To summarize or explain complex content' },
  { value: 'create_media', label: 'To create media or visuals for the assignment' }
];

// Helper function to get label from value
const getLabelFromValue = (value: string, options: Array<{value: string, label: string}>) => {
  const option = options.find(opt => opt.value === value);
  return option ? option.label : value;
};

interface AITool {
  toolName: string;
  aiType: string;
  purpose: string[] | string; // Can be array for multiple selections or string for backward compatibility
  settings: string;
}

interface CertificateData {
  studentId: string;
  studentName: string;
  assignmentTitle: string;
  courseCode: string;
  instructorName: string;
  aiTools: AITool[];
  submissionId: string;
  timestamp: string;
  additionalComments?: string;
}

export const generateStudentCertificate = (data: CertificateData) => {
  const doc = new jsPDF('portrait', 'mm', 'a4');
  
  // Define SJSU brand colors
  const sjsuBlue = '#0055A2';
  const sjsuGold = '#E5A823';
  const sjsuGray = '#939597';
  const sjsuLightBlue = '#E1F0FF';
  const sjsuLightGold = '#FFF8E8';
  
  // Logo dimensions and scaling
  const logoWidth = 1092;
  const logoHeight = 205;
  const scaledWidth = 70; // Slightly smaller for better proportions
  const scaleFactor = scaledWidth / logoWidth;
  const scaledHeight = logoHeight * scaleFactor;
  const pdfWidth = 210;
  
  // Helper function to draw a section divider
  const drawSectionDivider = (yPos: number) => {
    doc.setDrawColor(sjsuGold);
    doc.setLineWidth(0.8); // Slightly thicker line
    doc.line(20, yPos, 190, yPos);
  };
  
  // Helper function to add a subtle background to sections
  const addSectionBackground = (yStart: number, yHeight: number) => {
    doc.setFillColor(sjsuLightBlue);
    doc.rect(15, yStart, 180, yHeight, 'F');
  };
  
  // Load SJSU logo
  const logoImg = document.createElement('img');
  logoImg.src = '/images/sjsu_logo.png';
  
  logoImg.onload = () => {
    const topMargin = 12; // Slightly higher position
    
    // Add SJSU Logo
    doc.addImage(
      logoImg,
      'PNG',
      (pdfWidth - scaledWidth) / 2,
      topMargin,
      scaledWidth,
      scaledHeight
    );
    
    // Add Title with improved styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(sjsuBlue);
    doc.text('AI Tool Usage Declaration', 105, topMargin + scaledHeight + 10, { align: 'center' });
    
    // Add gold divider under title
    drawSectionDivider(topMargin + scaledHeight + 15);
    
    // Add Submission Details with better formatting
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#333333');
    doc.text(`Submission ID: ${data.submissionId}`, 20, topMargin + scaledHeight + 25);
    doc.text(`Date: ${data.timestamp}`, 20, topMargin + scaledHeight + 30);
    
    // Add Student Information section with improved styling
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(sjsuBlue);
    doc.text('Student Information', 20, topMargin + scaledHeight + 40);
    
    // Create a more professional student info table
    const studentInfo = [
      ['Student ID:', data.studentId, 'Name:', data.studentName],
      ['Course Code:', data.courseCode, 'Assignment:', data.assignmentTitle],
      ['Instructor:', data.instructorName, '', '']
    ];
    
    doc.autoTable({
      startY: topMargin + scaledHeight + 45,
      body: studentInfo,
      theme: 'plain',
      styles: {
        fontSize: 11,
        cellPadding: 2,
        lineWidth: 0,
        textColor: '#333333'
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 30, textColor: sjsuBlue },
        1: { cellWidth: 50 },
        2: { fontStyle: 'bold', cellWidth: 30, textColor: sjsuBlue },
        3: { cellWidth: 50 }
      },
      margin: { left: 20 },
      tableWidth: 'auto'
    });
    
    // Add AI Tools Table
    const aiToolsTableHead = [['Tool Name', 'AI Type', 'Purpose', 'Settings']];
    const aiToolsTableBody = data.aiTools.map(tool => [
      getLabelFromValue(tool.toolName, aiToolOptions),
      getLabelFromValue(tool.aiType, aiTypeOptions),
      Array.isArray(tool.purpose)
        ? tool.purpose.map(p => getLabelFromValue(p, purposeOptions)).join('\n')
        : getLabelFromValue(tool.purpose, purposeOptions),
      tool.settings || '-'
    ]);
    
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: aiToolsTableHead,
      body: aiToolsTableBody,
      theme: 'grid',
      headStyles: {
        fillColor: '#0055A2',
        textColor: '#FFFFFF',
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      }
    });
    

    
    // Add Additional Comments Section (if provided)
    if (data.additionalComments) {
      doc.autoTable({
        startY: doc.previousAutoTable.finalY + 10,
        head: [['Additional Comments']],
        body: [[data.additionalComments]],
        theme: 'grid',
        headStyles: {
          fillColor: '#0055A2',
          textColor: '#FFFFFF',
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 10,
          cellPadding: 5
        }
      });
    }
    
    // Add Declaration
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    const declaration = 'I hereby confirm that the above AI tools were used ethically and in compliance with SJSU\'s academic integrity policy.';
    doc.text(declaration, 20, doc.previousAutoTable.finalY + 20, {
      maxWidth: 170
    });
    
    // Add Student Signature Line
    doc.setFont('helvetica', 'normal');
    doc.line(20, doc.previousAutoTable.finalY + 40, 90, doc.previousAutoTable.finalY + 40);
    doc.text('Student Signature', 20, doc.previousAutoTable.finalY + 45);
    
    // Add Date Line
    doc.line(120, doc.previousAutoTable.finalY + 40, 190, doc.previousAutoTable.finalY + 40);
    doc.text('Date', 120, doc.previousAutoTable.finalY + 45);
    
    // Add Footer
    doc.setFontSize(8);
    doc.text('This is an official SJSU AI Usage Declaration document.', 105, 290, { align: 'center' });
    
    // Save the PDF
    doc.save(`AI_Declaration_${data.studentId}.pdf`);
  };
};