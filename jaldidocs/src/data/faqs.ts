// src/data/faqs.ts
export interface FAQ {
  question: string;
  answer: string;
}

export const HOME_FAQS: FAQ[] = [
  {
    question: 'Is JaldiDocs completely free?',
    answer: 'Yes. All tools on JaldiDocs are free to use. There is no subscription, no sign-up, and no hidden cost. We may show non-intrusive ads in the future to sustain the service, but the tools will always remain free.',
  },
  {
    question: 'Are my files uploaded to a server?',
    answer: 'No. All file processing happens entirely in your browser. Your photos, PDFs, and documents never leave your device. We do not upload, store, or have access to your files. This is our core privacy promise.',
  },
  {
    question: 'Can I use these tools on my mobile phone?',
    answer: 'Yes. JaldiDocs is built mobile-first. All tools work on Android and iPhone browsers. The interface adjusts cleanly for smaller screens, and file uploads work from your phone gallery or camera.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No account is needed. You can use every tool instantly without signing up or logging in. Your invoice and rent receipt drafts are saved locally in your browser if you choose to save them.',
  },
  {
    question: 'Can I use these tools for passport or government forms?',
    answer: 'Our tools help you prepare photos and documents to common specifications. However, official requirements can change, and different portals may have different rules. Always verify the exact requirements on the official website before submitting. We do not guarantee acceptance of any document.',
  },
  {
    question: 'Will PDF compression always reduce file size?',
    answer: 'Not always. Browser-based PDF compression works best on text-heavy PDFs. Scanned PDFs and image-heavy PDFs are harder to compress without server-side tools. We will always show you an honest result and not fake the numbers.',
  },
];

export const IMAGE_RESIZE_FAQS: FAQ[] = [
  {
    question: 'What image formats can I resize?',
    answer: 'You can resize JPG, JPEG, PNG, and WEBP images. The output can be saved as JPG, PNG, or WEBP.',
  },
  {
    question: 'Is there a file size limit?',
    answer: 'There is no hard limit set by JaldiDocs, but very large images (over 20MB) may be slow to process depending on your device. For best performance, use images under 10MB.',
  },
  {
    question: 'Will resizing reduce image quality?',
    answer: 'Reducing dimensions naturally reduces some detail. You can adjust the quality slider (for JPG/WEBP) to balance file size and sharpness. Increasing dimensions beyond the original will not add detail.',
  },
  {
    question: 'What size should I use for exam forms?',
    answer: 'Most government exam portals like SSC, UPSC, and state PSCs require photos between 20KB–50KB, commonly at 3.5cm × 4.5cm (about 200×300 px at 96 DPI). Check the specific notification for exact requirements.',
  },
];

export const IMAGE_COMPRESS_FAQS: FAQ[] = [
  {
    question: 'How much can I compress an image?',
    answer: 'This depends on the original image. A large JPG can often be reduced by 60–80% with minimal visible quality loss. PNG files with flat colors compress more than detailed photos.',
  },
  {
    question: 'Can I compress an image under 50KB?',
    answer: 'Yes, use the "Under 50KB" preset. The tool will try to meet the target. For very high-resolution photos, it may also reduce dimensions slightly to meet the target. The actual result depends on the image content.',
  },
  {
    question: 'Does compressing damage my original file?',
    answer: 'No. Your original file is never modified. All processing happens in the browser and you download only the compressed version. The original stays on your device unchanged.',
  },
];

export const PASSPORT_FAQS: FAQ[] = [
  {
    question: 'What is the correct size for Indian passport photos?',
    answer: 'The standard size is 35mm × 45mm (approximately 413 × 531 pixels at 300 DPI). The background should be plain white. The face should cover 70–80% of the frame.',
  },
  {
    question: 'Can I use this photo for official passport application?',
    answer: 'This tool helps you create a properly sized photo. However, always verify the latest requirements on the Passport Seva portal (passportindia.gov.in) before submitting. Requirements can vary and change.',
  },
  {
    question: 'Can I print multiple passport photos on one sheet?',
    answer: 'Yes. After creating your passport photo, you can generate a printable 4×6 inch sheet with multiple copies of the photo arranged for printing.',
  },
];

export const INVOICE_FAQS: FAQ[] = [
  {
    question: 'Is the invoice legally valid?',
    answer: 'The invoice generated is a standard format that includes GST fields. However, legal validity depends on your business registration, tax compliance, and adherence to GST rules. Consult a CA or tax professional for legal invoice requirements.',
  },
  {
    question: 'Is my invoice data saved on a server?',
    answer: 'No. All invoice data is saved only in your browser\'s localStorage if you click "Save Draft". Your data never leaves your device. Clearing your browser data will clear the saved draft.',
  },
  {
    question: 'Can I add multiple items to an invoice?',
    answer: 'Yes. You can add, remove, and edit as many line items as needed. GST, discounts, and totals are calculated automatically.',
  },
];

export const MERGE_PDF_FAQS: FAQ[] = [
  {
    question: 'How many PDFs can I merge at once?',
    answer: 'You can merge multiple PDFs, but browser memory is a constraint. For best results, keep the total combined size under 50MB. Very large merges may be slow on older devices.',
  },
  {
    question: 'Will my merged PDF lose quality?',
    answer: 'No. The merger combines PDF pages as-is, without re-rendering or compressing content. The output quality matches the input.',
  },
  {
    question: 'What if a PDF is password-protected?',
    answer: 'Encrypted or password-protected PDFs cannot be merged by browser-based tools. You will need to remove the password protection first using the original software that created the PDF.',
  },
];

export const PDF_COMPRESS_FAQS: FAQ[] = [
  {
    question: 'Why is my PDF not getting smaller?',
    answer: 'Browser-based PDF compression works mainly on text-heavy PDFs. If your PDF is primarily scanned images or photos, compression will have little effect. True image recompression in PDFs requires server-side processing.',
  },
  {
    question: 'Is it safe to use this compressor?',
    answer: 'Yes. Your PDF file never leaves your browser. The tool attempts a basic rebuild of the PDF structure to remove unnecessary metadata and optimize where possible.',
  },
];
