import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import { EmailLayout, button, h1, smallMuted, text } from './_layout'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ confirmationUrl }: RecoveryEmailProps) => (
  <EmailLayout preview="Redefinição de senha — GARIMPO AUTO">
    <Heading style={h1}>Redefinir sua senha</Heading>
    <Text style={text}>
      Recebemos um pedido para redefinir a senha da sua conta. Clique no botão
      abaixo para criar uma nova senha.
    </Text>
    <Button style={button} href={confirmationUrl}>
      CRIAR NOVA SENHA
    </Button>
    <Text style={{ ...smallMuted, margin: '24px 0 0' }}>
      Se não foi você, ignore este e-mail — sua senha atual continua válida.
    </Text>
  </EmailLayout>
)

export default RecoveryEmail
