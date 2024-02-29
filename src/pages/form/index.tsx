import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/system/Unstable_Grid";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 104857600;
const API_URL = "https://rtrouptlxh.execute-api.us-east-2.amazonaws.com/v1";

const uploadDocument = async (fileName: string, formData: FormData) => {
  const response = await fetch(`${API_URL}/file?filename=${fileName}`, {
    method: "POST",
    body: formData,
  });

  return await response.json();
};

const deleteDocument = async (fileName: string) => {
  const response = await fetch(`${API_URL}/file/${fileName}`, {
    method: "DELETE",
  });

  return await response.json();
};

const createEmail = async (payload: any) => {
  const response = await fetch(`${API_URL}/email`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return await response.json();
};

export const EmtForm = () => {
  const navigate = useNavigate();
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailFrom, setEmailFrom] = useState("alex.resendiz@protonmail.com");
  const [emailTo, setEmailTo] = useState("alejandro.resendiz.wp@gmail.com");
  const [emailSubject, setEmailSubject] = useState("Hello there");
  const [emailBody, setEmailBody] = useState("Greetings, stranger");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsFileUploading(true);

      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await uploadDocument(file.name, formData);
      setFileUrl(data);
      setIsFileUploading(false);
    },
    [setIsFileUploading, setFileName, setFileUrl]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: MAX_FILE_SIZE,
    onDrop,
  });

  const onCreateEmail = useCallback(async () => {
    setIsSending(true);

    const { data } = await createEmail({
      from: emailFrom,
      to: [emailTo],
      subject: emailSubject,
      body: `<html><head><\/head><body><h1>Amazon Pinpoint Email<\/h1><p>${emailBody}. This email was sent with<a href='https:\/\/aws.amazon.com\/pinpoint\/'>Amazon Pinpoint<\/a><\/p><\/body><\/html>`,
      file_url: fileUrl
    });
    console.log(data)
    
    setIsSending(false);
    navigate("/dashboard");
  }, [
    isSending,
    emailFrom,
    emailTo,
    emailSubject,
    emailBody,
    fileUrl
  ]);

  const onEmailFromValueChange = (event: any) => {
    setEmailFrom(event.target.value);
  };

  const onEmailToValueChange = (event: any) => {
    setEmailTo(event.target.value);
  };

  const onEmailSubjectValueChange = (event: any) => {
    setEmailSubject(event.target.value);
  };

  const onEmailBodyValueChange = (event: any) => {
    setEmailBody(event.target.value);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid xs={12}>
            <Box sx={{ display: "flex", flexDirection: "column", pl: 2 }}>
              <Typography variant="h4" gutterBottom>
                Email Tracker
              </Typography>
              <Typography variant="h6" gutterBottom>
                Prerequisites
              </Typography>
              <Typography variant="body1" gutterBottom>
                You may need to validate any email identity entered to this
                service. Please ask your administrator to help you with this
                process.
              </Typography>
            </Box>
            <Divider />
          </Grid>

          <Grid
            xs={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
            }}
          >
            <TextField
              required
              type="email"
              disabled={isSending}
              id="email-from"
              label="Email From"
              value={emailFrom}
              onChange={onEmailFromValueChange}
              variant="standard"
            />
          </Grid>
          <Grid
            xs={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
            }}
          >
            <TextField
              required
              disabled={isSending}
              type="email"
              id="email-to"
              label="Email To"
              value={emailTo}
              onChange={onEmailToValueChange}
              variant="standard"
            />
          </Grid>
          <Grid
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
            }}
          >
            <TextField
              required
              disabled={isSending}
              id="email-subject"
              label="Subject"
              value={emailSubject}
              onChange={onEmailSubjectValueChange}
              variant="standard"
            />
          </Grid>

          <Grid
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
            }}
          >
            <TextField
              required
              disabled={isSending}
              id="email_body"
              label="Body"
              multiline
              rows={4}
              value={emailBody}
              onChange={onEmailBodyValueChange}
              variant="standard"
            />
          </Grid>

          <Grid
            container
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: 2,
            }}
          >
            <Typography variant="body1" gutterBottom>
              Please upload any PDF document, the system will take care of
              attaching it in the email body.
            </Typography>
            {isFileUploading ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 4,
                }}
              >
                <Typography variant="body2" gutterBottom>
                  Your Document is being uploaded. Please wait a moment...
                </Typography>
              </Box>
            ) : fileUrl ? (
              <a href={fileUrl}>Current File URL</a>
              // TODO: Button to delete file.  Endpoint already exists in the backend
            ) : (
              <Box
                sx={{
                  backgroundColor: "#FAFAFA",
                  border: "1px dashed",
                  borderRadius: "2px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 2,
                  width: "95%",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Typography variant="body2" gutterBottom>
                  To upload a file, either click within this area or drag and
                  drop your file here. Max file size: 100mb.
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid
            container
            xs={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: 2,
            }}
          >
            <Button
              disabled={
                !fileUrl ||
                !emailFrom ||
                !emailTo ||
                !emailSubject ||
                !emailBody ||
                isSending
              }
              variant="contained"
              onClick={onCreateEmail}
            >
              Send Email
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
