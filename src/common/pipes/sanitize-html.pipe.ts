import {
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as DOMPurify from 'isomorphic-dompurify';

interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttr?: string[];
}

@Injectable()
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(
    private options: SanitizeOptions = {},
  ) {}

  transform(value: any) {
    if (typeof value !== 'string') {
      return value;
    }

    const config = {
      // Strip all HTML tags by default, but allow customization
      ALLOWED_TAGS:
        this.options.allowedTags || [],
      ALLOWED_ATTR:
        this.options.allowedAttr || [],
      KEEP_CONTENT: true, // Keep text content when removing tags
      FORBID_TAGS: [
        'script',
        'style',
        'iframe',
        'object',
        'embed',
      ],
    };

    // Use the config object for consistent sanitization
    return DOMPurify.sanitize(value, config);
  }
}
