import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, button, h1, panel, smallMuted, text } from './_layout'

interface EmailChangeEmailProps {
  siteName: string
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  oldEmail,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <EmailLayout preview="Confirme seu novo e-mail — GARIMPO AUTO">
    <Heading style={h1}>Confirme seu novo e-mail</Heading>
    <Text style={text}>
      Foi solicitada a alteração do e-mail da sua conta. Confirme para concluir
      a mudança.
    </Text>
    <div style={panel}>
      <Text style={{ ...smallMuted, margin: '0 0 4px' }}>Atual</Text>
      <Text style={{ ...text, margin: '0 0 12px', color: '#0A0A0A' }}>
        {oldEmail || email}
      </Text>
      <Text style={{ ...smallMuted, margin: '0 0 4px' }}>Novo</Text>
      <Text style={{ ...text, margin: '0', color: '#0A0A0A' }}>
        {newEmail || email}
      </Text>
    </div>
    <Button style={button} href={confirmationUrl}>
      CONFIRMAR ALTERAÇÃO
    </Button>
    <Text style={{ ...smallMuted, margin: '24px 0 0' }}>
      Se você não pediu esta alteração, ignore este e-mail.
    </Text>
  </EmailLayout>
)

export default EmailChangeEmail
