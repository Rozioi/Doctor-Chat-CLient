import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Typography, Spin } from "antd";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { IoIosArrowBack } from "react-icons/io";
import styles from "./InfoPage.module.scss";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
const { Title } = Typography;

export default function PdfViewer({
  fileUrl,
  title,
}: {
  fileUrl: string;
  title: string;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const { goBack } = useAppNavigation();

  useEffect(() => {
    setPageNumber(1);
  }, [fileUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }


  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={goBack}>
          <IoIosArrowBack />
          <span>Назад</span>
        </button>
        <Title level={3} className={styles.title}>
          {title}
        </Title>
      </div>

      <div className={styles.viewer}>
        {loading && (
          <div className={styles.loading}>
            <Spin size="large" tip="Загружаем документ..." />
          </div>
        )}

        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            width={typeof window !== "undefined" ? window.innerWidth - 40 : 800}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {numPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: numPages }, (_, i) => {
            const page = i + 1;
            const isActive = page === pageNumber;
            return (
              <button
                key={page}
                onClick={() => setPageNumber(page)}
                className={`${styles.pageButton} ${isActive ? styles.pageButtonActive : ""
                  }`}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
