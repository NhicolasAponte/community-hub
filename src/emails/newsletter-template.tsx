import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface NewsletterEmailProps {
  title: string;
  content: string;
  recipientName?: string;
  unsubscribeUrl: string;
}

export const NewsletterEmail = ({
  title,
  content,
  recipientName,
  unsubscribeUrl,
}: NewsletterEmailProps) => {
  // Convert content from potentially HTML to plain text sections
  const contentSections = content
    .split("\n")
    .filter((section) => section.trim());

  return (
    <Html>
      <Head />
      <Preview>{title} - Community Hub Newsletter</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Community Hub</Heading>
            <Text style={headerSubtitle}>Newsletter</Text>
          </Section>

          {/* Greeting */}
          <Section style={greetingSection}>
            <Text style={greeting}>
              {recipientName ? `Hi ${recipientName},` : "Hello,"}
            </Text>
          </Section>

          {/* Newsletter Title */}
          <Section style={titleSection}>
            <Heading style={newsletterTitle}>{title}</Heading>
          </Section>

          {/* Newsletter Content */}
          <Section style={contentSection}>
            {contentSections.map((section, index) => (
              <Text key={index} style={contentText}>
                {section}
              </Text>
            ))}
          </Section>

          {/* Call to Action */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Stay connected with your community! Visit our website for more
              updates and events.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because you subscribed to the
              Community Hub newsletter.
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Unsubscribe from these emails
              </Link>
            </Text>
            <Text style={footerText}>
              © 2025 Community Hub. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "20px 40px",
  backgroundColor: "#2563eb",
  borderRadius: "8px 8px 0 0",
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 8px 0",
  textAlign: "center" as const,
};

const headerSubtitle = {
  color: "#e0e7ff",
  fontSize: "16px",
  margin: "0",
  textAlign: "center" as const,
};

const greetingSection = {
  padding: "20px 40px 0",
};

const greeting = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0",
};

const titleSection = {
  padding: "20px 40px 0",
};

const newsletterTitle = {
  color: "#111827",
  fontSize: "28px",
  fontWeight: "bold",
  lineHeight: "1.3",
  margin: "0",
};

const contentSection = {
  padding: "20px 40px",
};

const contentText = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const ctaSection = {
  padding: "20px 40px",
  backgroundColor: "#f9fafb",
  margin: "0 40px",
  borderRadius: "8px",
};

const ctaText = {
  color: "#6b7280",
  fontSize: "14px",
  fontStyle: "italic",
  lineHeight: "1.5",
  margin: "0",
  textAlign: "center" as const,
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "40px 40px 20px",
};

const footer = {
  padding: "0 40px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 8px 0",
  textAlign: "center" as const,
};

const unsubscribeLink = {
  color: "#2563eb",
  textDecoration: "underline",
};

export default NewsletterEmail;
