const crypto = require('node:crypto')
const fs = require('node:fs')
const readline = require('node:readline')

// Create an interface for reading password input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
})

// Prompt for a password
rl.question('Enter a password for encryption: ', (password) => {
  // Close the readline interface
  rl.close()

  // Read the contents of the .env file
  const envContent = fs.readFileSync('.env', 'utf8')

  // Generate a 16-byte initialization vector (IV)
  const iv = crypto.randomBytes(16)

  // Encrypt function
  function encrypt(text) {
    const key = crypto.scryptSync(password, 'salt', 32) // Derive a key
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
  }

  // Encrypt the contents of the .env file
  const encryptedData = encrypt(envContent)

  // Save the IV and encrypted data to .env.enc
  const encryptedContent = `${iv.toString('hex')}:${encryptedData}`
  fs.writeFileSync('.env.enc', encryptedContent)

  console.log('.env file encrypted and saved to .env.enc')
})
