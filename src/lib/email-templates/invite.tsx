import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, button, h1, smallMuted, text } from './_layout'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteUrl, confirmationUrl }: InviteEmailProps) => (
  <EmailLayout preview="Você foi convidado para a GARIMPO AUTO" siteUrl={siteUrl}>
    <Heading style={h1}>Você recebeu um convite</Heading>
    <Text style={text}>
      Você foi convidado para acessar a plataforma da GARIMPO AUTO. Crie sua
      senha e ative o acesso pelo botão abaixo.
    </Text>
    <Button style={button} href={confirmationUrl}>
      ATIVAR MEU ACESSO
    </Button>
    <Text style={{ ...smallMuted, margin: '24px 0 0' }}>
      Se você não esperava este convite, pode ignorar este e-mail.
    </Text>
  </EmailLayout>
)

export default InviteEmail
