import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { BusinessError, BusinessLogicException } from '../errors/business-errors';

function getMimeType(buffer) {
  const signature = buffer.slice(0, 12);

  if (signature.includes(Buffer.from('89504e47', 'hex'))) {
    return 'image/png';
  }
  if (signature.includes(Buffer.from('47494638', 'hex'))) {
    return 'image/gif';
  }
  if (
    signature.includes(Buffer.from('ffd8ffe0', 'hex')) ||
    signature.includes(Buffer.from('ffd8ffe1', 'hex')) ||
    signature.includes(Buffer.from('ffd8ffe2', 'hex'))
  ) {
    return 'image/jpeg';
  }
  if (signature.includes(Buffer.from('52494646', 'hex'))) {
    return 'image/webp';
  }
  if (signature.includes(Buffer.from('424d', 'hex'))) {
    return 'image/bmp';
  }
  if (
    signature.includes(Buffer.from('49492a00', 'hex')) ||
    signature.includes(Buffer.from('4d4d002a', 'hex'))
  ) {
    return 'image/tiff';
  }
  if (signature.includes(Buffer.from('504b0304', 'hex'))) {
    return 'image/vnd.dwg';
  }
  if (signature.includes(Buffer.from('504b0708', 'hex'))) {
    return 'image/vnd.ms-office.drawingml';
  }
  if (signature.includes(Buffer.from('25504446', 'hex'))) {
    return 'application/pdf';
  }

  throw new BusinessLogicException(
    'La información en base64 no coincide con un formato de imagen',
    BusinessError.BAD_REQUEST,
  );
}

function getExtensionFromMimeType(mimeType) {
  const mimeToExt = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/vnd.dwg': 'dwg',
    'image/vnd.ms-office.drawingml': 'dxf',
    // Add more mappings as needed
  };

  return mimeToExt[mimeType] || '';
}

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3();
  }

  async uploadImage(base64Data: string) {
    const buffer = Buffer.from(base64Data, 'base64');
    const mimeType = getMimeType(buffer);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${uuidv4()}.${getExtensionFromMimeType(mimeType)}`,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read',
    };

    const response = await this.s3.upload(params).promise();
    return [response.Location, response.Key];
  }

  async deleteImage(Key: string) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key,
    };
    await this.s3.deleteObject(params).promise();
    console.log();
  }
}
