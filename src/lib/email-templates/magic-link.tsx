import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, button, h1, smallMuted, text } from './_layout'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ confirmationUrl }: MagicLinkEmailProps) => (
  <EmailLayout preview="Seu link de acesso à GARIMPO AUTO">
    <Heading style={h1}>Seu link de acesso</Heading>
    <Text style={text}>
      Use o botão abaixo para entrar na sua conta. O link é pessoal e expira em
      poucos minutos.
    </Text>
    <Button style={button} href={confirmationUrl}>
      ENTRAR AGORA
    </Button>
    <Text style={{ ...smallMuted, margin: '24px 0 0' }}>
      Se você não solicitou este acesso, ignore este e-mail.
    </Text>
  </EmailLayout>
)

export default MagicLinkEmail
