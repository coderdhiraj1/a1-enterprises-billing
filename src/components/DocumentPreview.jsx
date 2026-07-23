'use client';

import React from 'react';
import { ArrowLeft, Printer, Download, CreditCard, ShieldCheck, Pencil, Loader2 } from 'lucide-react';
import Image from 'next/image';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

// Indian Number to Words Converter
function numberToIndianWords(amount) {
  const num = Math.floor(amount);
  const paise = Math.round((amount - num) * 100);

  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty ', 'Thirty ', 'Forty ', 'Fifty ', 'Sixty ', 'Seventy ', 'Eighty ', 'Ninety '];

  function convertLessThanOneThousand(n) {
    if (n === 0) return '';
    let tempStr = '';
    if (n >= 100) {
      tempStr += a[Math.floor(n / 100)] + 'Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (tempStr !== '') tempStr += 'and ';
      if (n < 20) {
        tempStr += a[n];
      } else {
        tempStr += b[Math.floor(n / 10)] + a[n % 10];
      }
    }
    return tempStr;
  }

  if (num === 0) return 'Zero Rupees Only';

  let str = '';
  let crore = Math.floor(num / 10000000);
  let remaining = num % 10000000;
  let lakh = Math.floor(remaining / 100000);
  remaining %= 100000;
  let thousand = Math.floor(remaining / 1000);
  remaining %= 1000;

  if (crore > 0) {
    str += convertLessThanOneThousand(crore) + 'Crore ';
  }
  if (lakh > 0) {
    str += convertLessThanOneThousand(lakh) + 'Lakh ';
  }
  if (thousand > 0) {
    str += convertLessThanOneThousand(thousand) + 'Thousand ';
  }
  if (remaining > 0) {
    str += convertLessThanOneThousand(remaining);
  }

  str += 'Rupees ';
  
  if (paise > 0) {
    str += 'and ' + convertLessThanOneThousand(paise) + 'Paise ';
  }

  str += 'Only';
  return str.replace(/\s+/g, ' ').trim();
}

export default function DocumentPreview({ doc, onBack, onEdit }) {
  const isBill = doc.type === 'bill';
  const [isEditing, setIsEditing] = React.useState(false);
  const [previewZoom, setPreviewZoom] = React.useState(1);
  const [docHeight, setDocHeight] = React.useState(1123);
  const documentRef = React.useRef(null);
  const measureRef = React.useRef(null);

  // Ensure page is at the very top when document loads so mobile users see the action header
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Calculate zoom to fit mobile screen width accurately
    const calculateZoom = () => {
      // Use the measuring element's width instead of window.innerWidth 
      // because mobile browsers artificially inflate innerWidth when large elements exist.
      const screenWidth = measureRef.current ? measureRef.current.offsetWidth : window.innerWidth;
      
      if (screenWidth > 0 && screenWidth < 850) {
        setPreviewZoom((screenWidth - 40) / 800); // 40px for margins
      } else {
        setPreviewZoom(1);
      }
    };
    
    calculateZoom();
    window.addEventListener('resize', calculateZoom);
    
    // Observer to track document height dynamically so we can shrink the wrapper height
    let resizeObserver;
    if (documentRef.current) {
      resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setDocHeight(entry.target.offsetHeight);
        }
      });
      resizeObserver.observe(documentRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', calculateZoom);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    if (onEdit) onEdit();
  };
  const [bankInfo, setBankInfo] = React.useState({
    bankName: 'ICICI BANK',
    accountName: 'Rakesh Sharma',
    accountNumber: '329701501647',
    ifscCode: 'ICICI0003297'
  });

  React.useEffect(() => {
    const saved = localStorage.getItem('a1_seller_details');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setBankInfo({
          bankName: data.bankName || 'ICICI BANK',
          accountName: data.accountName || 'Rakesh Sharma',
          accountNumber: data.accountNumber || '329701501647',
          ifscCode: data.ifscCode || 'ICICI0003297'
        });
      } catch (e) {}
    }
  }, []);

  const handlePrint = async () => {
    try {
      const element = document.getElementById('invoice-document');
      if (!element) return;

      // Temporarily strip card border, shadow and rounding styles for clean A4 PDF boundaries
      element.classList.remove('border', 'border-zinc-200', 'shadow-lg', 'rounded-2xl');
      element.style.transform = 'none'; // reset transform for clean 1:1 capture

      // Prevent page breaks inside specific elements by pushing them to the next page
      const avoidElements = element.querySelectorAll('.avoid-break');
      const originalMargins = new Map();
      // Calculate approximately how many DOM pixels equal one PDF page content height
      // PDF A4 is 210x297mm. We have 10mm margins on all sides. So content is 190x277mm.
      const domPageHeight = (element.offsetWidth * 277) / 190; 

      avoidElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const parentRect = element.getBoundingClientRect();
        const offsetTop = rect.top - parentRect.top;
        
        const pageOfTop = Math.floor(offsetTop / domPageHeight);
        const pageOfBottom = Math.floor((offsetTop + rect.height) / domPageHeight);
        
        if (pageOfTop !== pageOfBottom) {
          const distanceToNextPage = ((pageOfTop + 1) * domPageHeight) - offsetTop;
          const currentMargin = parseFloat(window.getComputedStyle(el).marginTop) || 0;
          originalMargins.set(el, el.style.marginTop);
          // Add distance to the existing margin, plus a small 5px buffer
          el.style.marginTop = `${currentMargin + distanceToNextPage + 5}px`;
        }
      });

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution scale factor (2x density)
        useCORS: true,
        logging: true
      });

      // Restore card styling properties and margins
      element.classList.add('border', 'border-zinc-200', 'shadow-lg', 'rounded-2xl');
      avoidElements.forEach((el) => {
        el.style.marginTop = originalMargins.get(el) || '';
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.75);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const margin = 10; // 10mm margin for clean padding
      const pdfWidth = 210; 
      const pdfHeight = 297; 
      const contentWidth = pdfWidth - (2 * margin);
      const contentHeight = pdfHeight - (2 * margin);
      
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      
      // Mask bottom margin of first page
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, pdfHeight - margin, pdfWidth, margin, 'F');
      
      heightLeft -= contentHeight;

      while (heightLeft > 0) {
        position = position - contentHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
        
        // Mask top margin
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pdfWidth, margin, 'F');
        
        // Mask bottom margin
        pdf.rect(0, pdfHeight - margin, pdfWidth, margin, 'F');
        
        heightLeft -= contentHeight;
      }

      const sanitizedName = doc.customerName
        ? doc.customerName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_')
        : 'Customer';
      pdf.save(`${doc.number}_${sanitizedName}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF file download. Error: ' + error.message);
    } finally {
      // Restore card styling properties in both success and failure cases
      const element = document.getElementById('invoice-document');
      if (element) {
        element.classList.add('border', 'border-zinc-200', 'shadow-lg', 'rounded-2xl');
        element.style.transform = previewZoom < 1 ? `scale(${previewZoom})` : 'none';
      }
    }
  };

  return (
    <div className="max-w-[800px] mx-auto w-full space-y-6 relative">
      {/* Invisible element to accurately measure available width on mobile */}
      <div ref={measureRef} className="w-full h-0 absolute top-0 left-0 pointer-events-none" />

      {/* Action Header bar (Hidden on Print) */}
      <div className="print:hidden bg-white p-4 rounded-xl border border-zinc-200 shadow-xs flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>

        <div className="flex gap-3">
          {onEdit && (
            <button
              type="button"
              onClick={handleEdit}
              disabled={isEditing}
              className={`flex items-center gap-1.5 px-4.5 py-2 bg-white border border-zinc-200 text-zinc-600 hover:text-[#b2801e] hover:border-[#b2801e] hover:bg-[#b2801e]/5 rounded-lg text-xs font-bold shadow-xs transition-all ${isEditing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isEditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
              <span className="hidden sm:inline">{isEditing ? 'Loading...' : 'Edit'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-[#0b2240] hover:bg-[#1a3556] text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">Download</span>
          </button>
        </div>
      </div>

      {/* Invoice Area Container */}
      <div className="w-full pb-4 flex justify-center overflow-visible">
        {/* Dynamic Wrapper that perfectly fits the scaled document to prevent scrollbars */}
        <div 
          style={{ 
            width: previewZoom < 1 ? 800 * previewZoom : '100%', 
            height: previewZoom < 1 ? docHeight * previewZoom : 'auto',
            position: 'relative'
          }}
        >
          <div 
            id="invoice-document"
            ref={documentRef}
            style={{ 
              transform: previewZoom < 1 ? `scale(${previewZoom})` : 'none',
              transformOrigin: 'top left'
            }}
            className={`w-[800px] min-w-[800px] bg-white text-zinc-800 p-10 border border-zinc-200 shadow-lg print:border-0 print:shadow-none print:p-0 rounded-2xl print:rounded-none ${previewZoom < 1 ? 'absolute top-0 left-0' : 'mx-auto'}`}
          >
          {/* Header Row */}
          <div className="flex flex-row justify-between items-start gap-4 pb-6 border-b-2 border-[#0b2240]">
            {/* Seller Logo & Info */}
            <div className="space-y-3">
              <div className="relative w-64 h-24 max-w-full">
                <img
                  src="/logo.png"
                  alt="A-1 Enterprises Fabrication Works"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-[11px] text-zinc-700 font-semibold space-y-0.5 mt-2">
                <p className="font-extrabold text-[#b2801e] text-[12px] uppercase">Fabrication Works Specialist</p>
                <p>Gates, Grills, SS Railings, Rolling Shutters, Structural Works</p>
                <p>Address: Shani Mandir Road, Shivar Basti, Marunji, Pune - 411057</p>
              </div>
            </div>

            {/* Document Meta */}
            <div className="text-right space-y-1.5 min-w-[200px]">
              <h1 className="text-2xl font-black text-[#0b2240] uppercase tracking-wide">
                {isBill ? 'Tax Invoice' : 'Quotation'}
              </h1>
              
              <div className="flex flex-col gap-0.5 text-xs">
                <div className="text-zinc-600 font-bold">Document No:</div>
                <div className="font-extrabold text-zinc-900">{doc.number}</div>
                
                <div className="text-zinc-600 font-bold">Date:</div>
                <div className="font-extrabold text-zinc-900">
                  {new Date(doc.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>

                {doc.validUntil && (
                  <>
                    <div className="text-zinc-600 font-bold">Valid Until:</div>
                    <div className="font-extrabold text-[#b2801e]">
                      {new Date(doc.validUntil).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </>
                )}

                <div className="text-zinc-600 font-bold">Contact Details:</div>
                <div className="font-bold text-zinc-800">
                  <p>+91-7759971969</p>
                  <p>enterprises.a1@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="avoid-break grid grid-cols-2 gap-6 py-6 border-b border-zinc-200">
            <div>
              <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Billed To:
              </h3>
              <div className="text-xs space-y-1">
                <p className="text-sm font-black text-zinc-900">{doc.customerName}</p>
                {doc.customerPhone && (
                  <p className="text-zinc-800 font-medium">
                    <span className="font-bold text-zinc-500">Phone:</span> {doc.customerPhone}
                  </p>
                )}
                {doc.customerAddress && (
                  <p className="text-zinc-800 leading-relaxed font-semibold whitespace-pre-line">
                    {doc.customerAddress}
                  </p>
                )}
              </div>
            </div>

            <div className="text-xs space-y-1.5 text-right">
              <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Service Provider:
              </h3>
              <p className="text-sm font-black text-[#0b2240]">A-1 Enterprises</p>
              <p className="text-zinc-800 font-semibold">Email: enterprises.a1@gmail.com</p>
              <p className="text-zinc-800 font-semibold">Phone: +91-7759971969</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs border-collapse mt-6">
            <thead>
              <tr className="bg-[#0b2240] text-white font-extrabold">
                <th className="py-3 px-3 w-12 text-center text-white border border-[#0b2240]">Sr.</th>
                <th className="py-3 px-2 text-white border border-[#0b2240]">Description</th>
                <th className="py-3 px-2 text-center w-16 text-white border border-[#0b2240]">Qty</th>
                <th className="py-3 px-2 text-center w-16 text-white border border-[#0b2240]">Unit</th>
                <th className="py-3 px-2 text-right w-24 text-white border border-[#0b2240]">Rate (₹)</th>
                <th className="py-3 px-3 text-right w-28 text-white border border-[#0b2240]">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {doc.items.map((item, idx) => (
                <tr key={idx} className="avoid-break border-b border-zinc-300 hover:bg-zinc-50/50 font-bold">
                  <td className="py-3 px-3 text-center text-zinc-800">{idx + 1}</td>
                  <td className="py-3 px-2 text-zinc-900 font-extrabold whitespace-pre-line">{item.description}</td>
                  <td className="py-3 px-2 text-center text-zinc-900">{item.qty}</td>
                  <td className="py-3 px-2 text-center text-zinc-800">{item.unit}</td>
                  <td className="py-3 px-2 text-right text-zinc-900 font-semibold">
                    {item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right text-zinc-950 font-black">
                    {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Row */}
          <div className="avoid-break grid grid-cols-12 gap-6 mt-6 pt-4">
            {/* Amount In Words */}
            <div className="col-span-7 space-y-4">
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Amount in Words:
                </p>
                <p className="text-xs font-bold text-[#b2801e] mt-1 capitalize font-semibold leading-relaxed">
                  {numberToIndianWords(doc.total)}
                </p>
              </div>

              {/* Note / Terms */}
              {doc.notes && (
                <div className="text-[11px] text-zinc-700 leading-relaxed font-semibold">
                  <span className="font-bold text-zinc-500 uppercase block mb-1">Notes / Terms:</span>
                  <p className="whitespace-pre-line">{doc.notes}</p>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="col-span-5 space-y-2.5 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-zinc-500">Subtotal</span>
                <span className="text-zinc-800 font-extrabold">
                  ₹{doc.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {doc.gstType !== 'none' && (
                <>
                  <div className="flex justify-between font-bold">
                    <span className="text-zinc-500">CGST (9% {doc.gstType === 'inclusive' ? 'Inc.' : ''})</span>
                    <span className="text-zinc-800 font-extrabold">
                      ₹{doc.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-zinc-500">SGST (9% {doc.gstType === 'inclusive' ? 'Inc.' : ''})</span>
                    <span className="text-zinc-800 font-extrabold">
                      ₹{doc.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              )}

              {doc.discount > 0 && (
                <div className="flex justify-between font-bold">
                  <span className="text-zinc-500">Discount</span>
                  <span className="text-rose-700 font-black">
                    -₹{doc.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="border-t-2 border-[#0b2240] pt-2.5 flex justify-between items-center text-sm font-bold">
                <span className="text-[#0b2240] uppercase tracking-wider text-xs font-black">Total Amount</span>
                <span className="text-lg font-black text-[#0b2240]">
                  ₹{doc.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
          {/* Payment & Signatures Row */}
          <div className="avoid-break grid grid-cols-12 gap-6 mt-8 pt-6 border-t border-zinc-200">
            {/* Bank Payment Mode Details */}
            <div className="col-span-7 space-y-3">
              <div className="border-2 border-zinc-200 rounded-xl bg-white overflow-hidden max-w-sm shadow-sm">
                <div className="bg-zinc-50/80 px-4 py-2.5 border-b border-zinc-200 flex items-center gap-2">
                   <CreditCard className="w-4 h-4 text-zinc-500" />
                   <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider">Payment Bank Details</span>
                </div>
                <div className="p-4 space-y-3">
                   <div className="flex justify-between text-xs">
                     <span className="text-zinc-500 font-bold">Bank Name</span>
                     <span className="font-extrabold text-zinc-900">{bankInfo.bankName}</span>
                   </div>
                   <div className="flex justify-between text-xs">
                     <span className="text-zinc-500 font-bold">Account Name</span>
                     <span className="font-extrabold text-zinc-900">{bankInfo.accountName}</span>
                   </div>
                   <div className="flex justify-between text-xs">
                     <span className="text-zinc-500 font-bold">A/C Number</span>
                     <span className="font-black text-zinc-950 font-mono tracking-wider">{bankInfo.accountNumber}</span>
                   </div>
                   <div className="flex justify-between text-xs pt-2.5 border-t border-dashed border-zinc-200">
                     <span className="text-zinc-500 font-bold">IFSC Code</span>
                     <span className="font-black text-[#b2801e] uppercase">{bankInfo.ifscCode}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Verification Sign off */}
            <div className="col-span-5 flex flex-col justify-between items-end min-h-[140px] text-right">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-500/10 px-2 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified</span>
              </div>
              
              <div className="space-y-1 pt-6 text-xs">
                <p className="text-zinc-500 font-bold">For A-1 Enterprises</p>
                <div className="h-12 flex items-center justify-end">
                  <span className="font-signature text-xl text-[#0b2240] tracking-wider select-none pr-2">
                    Rakesh Sharma
                  </span>
                </div>
                <p className="font-extrabold text-zinc-900 border-t border-zinc-400 pt-1.5 w-36 inline-block">
                  Authorized Signatory
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
