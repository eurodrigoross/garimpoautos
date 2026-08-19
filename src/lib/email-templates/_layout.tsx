import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export const colors = {
  ink: '#0A0A0A',
  body: '#4B4B4B',
  muted: '#8A8A8A',
  line: '#E6E6E6',
  panel: '#FAFAFA',
  prime: '#1D4ED8',
}

export const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
}

export const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '32px 28px 40px',
}

export const h1 = {
  fontSize: '22px',
  lineHeight: '1.25',
  fontWeight: 700 as const,
  color: colors.ink,
  letterSpacing: '-0.4px',
  margin: '0 0 16px',
}

export const text = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: colors.body,
  margin: '0 0 18px',
}

export const link = { color: colors.ink, textDecoration: 'underline' }

export const button = {
  display: 'inline-block',
  backgroundColor: colors.ink,
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 600 as const,
  letterSpacing: '0.4px',
  borderRadius: '10px',
  padding: '14px 26px',
  textDecoration: 'none',
}

export const panel = {
  backgroundColor: colors.panel,
  border: `1px solid ${colors.line}`,
  borderRadius: '12px',
  padding: '18px 20px',
  margin: '0 0 20px',
}

export const smallMuted = {
  fontSize: '12px',
  lineHeight: '1.6',
  color: colors.muted,
  margin: '0',
}

const wordmark = {
  fontSize: '13px',
  fontWeight: 700 as const,
  letterSpacing: '3px',
  color: colors.ink,
  margin: '0 0 28px',
  textDecoration: 'none',
}

const hr = { borderColor: colors.line, margin: '32px 0 16px' }

interface LayoutProps {
  preview: string
  siteUrl?: string
  children: React.ReactNode
}

export const EmailLayout = ({
  preview,
  siteUrl = 'https://garimpoautos.com.br',
  children,
}: LayoutProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Link href={siteUrl} style={wordmark}>
          GARIMPO AUTO
        </Link>
        <Section>{children}</Section>
        <Hr style={hr} />
        <Text style={smallMuted}>
          GARIMPO AUTO — assessoria em leilões e repasses.
          <br />
          Este é um e-mail automático de segurança da sua conta.
        </Text>
      </Container>
    </Body>
  </Html>
)

export { Heading, Text as EmailText }
