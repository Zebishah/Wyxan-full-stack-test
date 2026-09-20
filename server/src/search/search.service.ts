import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from '../sites/site.schema';

export type SearchResult = { address: string; title: string; author: string; snippet: string };

@Injectable()
export class SearchService {
  constructor(@InjectModel(Site.name) private readonly sites: Model<SiteDocument>) {}

  async search(query: string): Promise<SearchResult[]> {
    const q = query.trim();
    if (!q) return [];
    const expression = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const sites = await this.sites.find({ $or: [{ plainText: expression }, { title: expression }, { address: expression }] }).sort({ address: 1 }).lean();
    return sites.map((site) => {
      const source = site.plainText;
      const match = source.toLowerCase().indexOf(q.toLowerCase());
      const start = Math.max(0, match - 56);
      return {
        address: site.address,
        title: site.title,
        author: site.author,
        snippet: `${start > 0 ? '…' : ''}${source.slice(start, start + 150)}${source.length > start + 150 ? '…' : ''}`
      };
    });
  }
}
