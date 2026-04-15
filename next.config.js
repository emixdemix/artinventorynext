/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['sharp', 'bcrypt', 'aws-sdk', 's3-zip', 'nodemailer'],
}

module.exports = nextConfig
