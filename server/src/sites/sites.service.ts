import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import sanitizeHtml from 'sanitize-html';
import { Model } from 'mongoose';
import { normalizeAddress } from '../common/validation/address';
import { CreateSiteDto } from './dto/create-site.dto';
import { Site, SiteDocument } from './site.schema';

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'figure', 'figcaption'],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    '*': ['class', 'id', 'style', 'title'],
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  disallowedTagsMode: 'discard'
};

export const cleanSiteHtml = (html: string): string => sanitizeHtml(html, sanitizeOptions);
export const htmlToText = (html: string): string =>
  sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private readonly sites: Model<SiteDocument>) {}

  async findByAddress(address: string): Promise<SiteDocument> {
    const site = await this.sites.findOne({ address: normalizeAddress(address) }).lean();
    if (!site) throw new NotFoundException('That address is not part of the small web.');
    return site as SiteDocument;
  }

  async create(dto: CreateSiteDto): Promise<SiteDocument> {
    const address = normalizeAddress(dto.address);
    const existing = await this.sites.exists({ address });
    if (existing) throw new ConflictException('That address is already home to a site.');
    const html = cleanSiteHtml(dto.html);
    const site = await this.sites.create({ address, title: dto.title.trim(), author: dto.author.trim(), html, plainText: htmlToText(html) });
    return site.toObject() as SiteDocument;
  }

}
