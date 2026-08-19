import * as React from 'react'
import { Heading, Text } from '@react-email/components'
import { EmailLayout, colors, h1, panel, smallMuted, text } from './_layout'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <EmailLayout preview="Seu código de verificação — GARIMPO AUTO">
    <Heading style={h1}>Seu código de verificação</Heading>
    <Text style={text}>
      Use o código abaixo para confirmar esta ação na sua conta.
    </Text>
    <div style={{ ...panel, textAlign: 'center' as const }}>
      <Text
        style={{
          fontSize: '30px',
          fontWeight: 700,
          letterSpacing: '10px',
          color: colors.ink,
          margin: '0',
        }}
      >
        {token}
      </Text>
    </div>
    <Text style={smallMuted}>
      O código expira em poucos minutos. Se não foi você, ignore este e-mail.
    </Text>
  </EmailLayout>
)

export default ReauthenticationEmail
