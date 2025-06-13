import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";

export default function App() {
  const [file, setFile] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((accepted) => {
    setFile(accepted[0] || null);
    setQrUrl(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  const handleUpload = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("업로드 실패");
      const blob = await res.blob();
      const qrImageUrl = URL.createObjectURL(blob);
      setQrUrl(qrImageUrl);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }, [file]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 5, bgcolor: "#fff", borderRadius: 4 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            QR 코드 생성기
          </Typography>

          <Box
            {...getRootProps()}
            translate="no"
            sx={{
              border: "2px dashed #1976d2",
              borderRadius: 3,
              p: 4,
              textAlign: "center",
              bgcolor: isDragActive ? "#e3f2fd" : "#f5f7fa",
              cursor: "pointer",
              mb: 2,
              transition: "background 0.2s",
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="body1" sx={{ color: "#1976d2", fontWeight: "bold" }}>
              {isDragActive
                ? "여기에 파일을 놓으세요!"
                : "이미지를 드래그하거나 아래 버튼으로 선택하세요."}
            </Typography>
            <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
              {file ? `선택된 파일: ${file.name}` : "이미지 파일만 업로드 가능합니다."}
            </Typography>
            <Button
              variant="contained"
              onClick={open}
              sx={{ mt: 2, bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
            >
              파일 선택
            </Button>
          </Box>

          <Button
            variant="contained"
            fullWidth
            disabled={!file || loading}
            onClick={handleUpload}
            sx={{
              fontWeight: "bold",
              fontSize: 18,
              py: 1.5,
              mb: 2,
              bgcolor: "#43a047",
              "&:hover": { bgcolor: "#388e3c" },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "QR 코드 생성"}
          </Button>

          {qrUrl && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
                QR 코드 미리보기
              </Typography>
              <img
                src={qrUrl}
                alt="QR 코드"
                style={{
                  width: 256,
                  height: 256,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #eee",
                  background: "#fff",
                }}
              />
              <Button
                href={qrUrl}
                download="qr.png"
                variant="outlined"
                sx={{
                  mt: 2,
                  color: "#1976d2",
                  borderColor: "#1976d2",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#e3f2fd" },
                }}
              >
                다운로드
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}