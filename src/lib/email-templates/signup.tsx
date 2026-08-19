import * as React from 'react'
import { Button, Heading, Link, Text } from '@react-email/components'
import { EmailLayout, button, h1, link, smallMuted, text } from './_layout'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <EmailLayout preview="Confirme seu e-mail na GARIMPO AUTO" siteUrl={siteUrl}>
    <Heading style={h1}>Confirme seu e-mail</Heading>
    <Text style={text}>
      Recebemos um cadastro com o endereço{' '}
      <Link href={`mailto:${recipient}`} style={link}>
        {recipient}
      </Link>
      . Confirme para liberar o acesso à sua conta.
    </Text>
    <Button style={button} href={confirmationUrl}>
      CONFIRMAR E-MAIL
    </Button>
    <Text style={{ ...smallMuted, margin: '24px 0 0' }}>
      Se você não criou esta conta, ignore este e-mail.
    </Text>
  </EmailLayout>
)

export default SignupEmail
