const fs = require('node:fs')
const crypto = require('node:crypto')
const readline = require('node:readline')

// Helper function to decrypt the .env.enc file
function decrypt(encryptedData, ivHex, password) {
  const key = crypto.scryptSync(password, 'salt', 32)
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    Buffer.from(ivHex, 'hex')
  )
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// Helper function to prompt for a password
function promptPassword(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  })

  return new Promise((resolve) => {
    rl.question(question, (password) => {
      rl.close()
      resolve(password)
    })
  })
}

// Main logic
;(async () => {
  const envExists = fs.existsSync('.env')
  const envEncExists = fs.existsSync('.env.enc')

  if (envExists && !envEncExists) {
    // If .env exists but .env.enc does not, encrypt the .env file
    console.log('.env exists but .env.enc does not. Encrypting .env...')
    require('./encrypt.js')
  } else if (envEncExists && !envExists) {
    // If .env.enc exists but .env does not, decrypt .env.enc
    console.log('.env.enc exists but .env does not. Decrypting .env.enc...')

    // Read and split the IV and encrypted data from .env.enc
    const encryptedContent = fs.readFileSync('.env.enc', 'utf8')
    const [ivHex, encryptedData] = encryptedContent.split(':')

    // Prompt for a password to decrypt
    const password = await promptPassword(
      'Enter password to decrypt .env.enc: '
    )

    try {
      // Decrypt and save to .env
      const decrypted = decrypt(encryptedData, ivHex, password)
      fs.writeFileSync('.env', decrypted)
      console.log('.env file successfully restored from .env.enc')
    } catch (error) {
      console.error(
        'Decryption failed. Please check the password and try again.'
      )
    }
  } else {
    console.log('No encryption or decryption action needed.')
  }
})()
