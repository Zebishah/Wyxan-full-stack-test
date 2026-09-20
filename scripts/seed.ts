import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import mongoose, { Model } from 'mongoose';
import { resolve } from 'node:path';
import { Person, PersonDocument, PersonSchema } from '../server/src/people/person.schema';
import { Site, SiteDocument, SiteSchema } from '../server/src/sites/site.schema';
import { cleanSiteHtml, htmlToText } from '../server/src/sites/sites.service';
import { Visit, VisitDocument, VisitSchema } from '../server/src/visits/visit.schema';

for (const envPath of [resolve(process.cwd(), '.env'), resolve(process.cwd(), '../.env'), resolve(process.cwd(), 'server/.env')]) {
  loadEnv({ path: envPath });
}

const site = (address: string, title: string, author: string, body: string): { address: string; title: string; author: string; html: string; plainText: string } => {
  const html = cleanSiteHtml(body);
  return { address, title, author, html, plainText: htmlToText(html) };
};

const sites = [
  site('tidepool.zz', 'Notes from the tide line', 'Mara Quinn', `<style>body{background:#eaf1ef;color:#193a3b;font-family:Georgia,serif;line-height:1.7}h1{font-size:2.4rem}a{color:#a14d38}</style><h1>Notes from the tide line</h1><p>I keep a small notebook beside the back door, where the salt dries in pale rings. The ocean stretches beyond the breakwater, patient enough to make every timetable seem invented.</p><p>At low water there are anemones like dropped handkerchiefs and a green crab that has learned the hour of my arrival. <a href="observatory.zz">The observatory</a> has a better view of the moon. <a href="field-recordings.zz">Listen to the shore</a>.</p>`),
  site('observatory.zz', 'The roof observatory', 'Mara Quinn', `<style>body{background:#101827;color:#e5e9ee;font-family:Arial,sans-serif;padding:2rem}a{color:#e4ba67}</style><h1>The roof observatory</h1><p>On clear nights the old water tank becomes a modest planetarium. I mark the brightest stars on a paper chart and leave a red lamp burning for anyone who climbs the stairs.</p><p>Last Thursday, the moon made the chimney pots look silver. <a href="night-walks.zz">The night walk log</a> begins at the same hour. The lost catalogue is at <a href="forgotten.zz">this address</a>.</p>`),
  site('garden.zz', 'A garden in its fourth spring', 'Jon Bell', `<style>body{font-family:Georgia,serif;background:#f4f0df;color:#39422d}h1{font-weight:normal;border-bottom:1px solid #87926c}a{color:#98603f}</style><h1>A garden in its fourth spring</h1><p>The rosemary survived the winter, though it has chosen a new shape. Bees have found the blue borage before I have found my gloves.</p><p>These pages are less a guide than a record of attention. For recipes, visit <a href="kitchen-table.zz">the kitchen table</a>; for pressed leaves, go to <a href="botanical-notes.zz">the botanical notes</a>.</p>`),
  site('archive.zz', 'The little archive of almost things', 'Priya Das', `<style>body{font-family:monospace;background:#eeeae2;color:#2a2926}pre{border-left:3px solid #bd654c;padding-left:1rem}</style><h1>The little archive of almost things</h1><p>A museum for objects that were nearly kept: a cinema ticket, a map with no destination, a key whose lock has moved on.</p><p>Visitors may add a note in the margin. The best objects are often described by <a href="small-museum.zz">the small museum</a>. See also: <a href="train-stations.zz">stations without trains</a>.</p>`),
  site('train-stations.zz', 'Stations without trains', 'Priya Das', `<style>body{font-family:Georgia,serif;background:#ded7ca;color:#35302d}h1{font-size:2rem}a{color:#9c4e37}</style><h1>Stations without trains</h1><p>There is a platform past the quarry where the timetable still promises a 6:12. Grass grows between the sleepers, and the waiting room has become a cabinet for rain.</p><p>I collect station names and the stories people attach to them. <a href="maps-at-dusk.zz">Maps at dusk</a> keeps the route.</p>`),
  site('field-recordings.zz', 'Field recordings / listening notes', 'Eli Wren', `<style>body{background:#e4e9e4;color:#26352d;font-family:Arial,sans-serif}audio{width:100%}a{color:#4b7161}</style><h1>Field recordings</h1><p>There is a particular quiet before rain: not silence, but a softer arrangement of everything. Here are notes from the marsh, the harbor steps, and a room with one open window.</p><ul><li>marsh edge, 05:41 — reeds and one distant bicycle</li><li>harbor steps, 21:18 — ropes, gulls, buoy bell</li></ul><p>For the written companion, see <a href="tidepool.zz">the tide line</a>.</p>`),
  site('botanical-notes.zz', 'Botanical notes for an ordinary year', 'Jon Bell', `<style>body{background:#f7f6f0;color:#334037;font-family:Georgia,serif;max-width:44rem;margin:auto}dt{font-weight:bold;color:#7c5138}a{color:#547661}</style><h1>Botanical notes</h1><dl><dt>March — dandelion</dt><dd>Much maligned, very early, and the first yellow thing to appear in a grey field.</dd><dt>April — borage</dt><dd>Blue flowers, cucumber taste. The bees arrive before the gardener.</dd><dt>May — iris</dt><dd>Brief as a good idea. Draw it before the wind changes.</dd></dl><p>My weather record is kept at <a href="garden.zz">the garden</a>.</p>`),
  site('kitchen-table.zz', 'Recipes for when the weather turns', 'Eli Wren', `<style>body{font-family:Georgia,serif;background:#f5e5d5;color:#4b3329}h1{font-weight:normal}a{color:#a4513c}</style><h1>Recipes for when the weather turns</h1><p><strong>Rain soup:</strong> onions, a potato, whatever beans remain, and enough time to let the windows fog. The recipe is mostly a way of staying near the stove.</p><p>For a colder evening, make the old pear cake. I copied it from a card found in <a href="archive.zz">the archive</a>.</p>`),
  site('night-walks.zz', 'A log of night walks', 'Mara Quinn', `<style>body{background:#202b31;color:#d9d4c8;font-family:Georgia,serif;line-height:1.8}a{color:#d6a75f}</style><h1>A log of night walks</h1><p>Walk 17: the street lamps ended at the allotments. A fox crossed the path as if it had an appointment. Above the roofs, the sky was an unbroken dark.</p><p>Walk 18: low cloud, wet leaves, one lit window. <a href="observatory.zz">The roof observatory</a> was closed, but the stairs remembered my shoes.</p>`),
  site('maps-at-dusk.zz', 'Maps at dusk', 'Priya Das', `<style>body{background:#e9e0cf;color:#39392f;font-family:Arial,sans-serif}blockquote{border-left:3px solid #c27a52;padding-left:1rem}a{color:#9c583c}</style><h1>Maps at dusk</h1><blockquote>A map is an agreement about what to notice.</blockquote><p>I draw the paths that become uncertain after sunset: the old line to the quarry, the lane behind the bakery, the long way home from the station.</p><p>Somewhere in the margin is <a href="train-stations.zz">a station without a train</a>.</p>`),
  site('small-museum.zz', 'The small museum', 'Sana Ortiz', `<style>body{font-family:Georgia,serif;background:#f1f0ec;color:#303131}h1{letter-spacing:.06em;text-transform:uppercase;font-size:1.7rem}a{color:#7f5849}</style><h1>The small museum</h1><p>Admission is free. The collection contains a shell, a bus ticket, three photographs of the same cloud, and a label that simply says “found.”</p><p>Objects are cared for by people who have no official title. The archive is <a href="archive.zz">next door</a>.</p>`)
];

const people = [
  { name: 'Mara Quinn', slug: 'mara-quinn', bio: 'Keeps tide tables, star charts, and a notebook by the back door.' },
  { name: 'Jon Bell', slug: 'jon-bell', bio: 'Grows things slowly and records what survives.' },
  { name: 'Priya Das', slug: 'priya-das', bio: 'Collects maps, station names, and objects that almost disappeared.' },
  { name: 'Eli Wren', slug: 'eli-wren', bio: 'Listens carefully, especially when the weather changes.' },
  { name: 'Sana Ortiz', slug: 'sana-ortiz', bio: 'Visits small museums and leaves the lights on.' }
];

async function seed(): Promise<void> {
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/small-web');
  try {
    const siteModel: Model<SiteDocument> = mongoose.model(Site.name, SiteSchema);
    const personModel: Model<PersonDocument> = mongoose.model(Person.name, PersonSchema);
    const visitModel: Model<VisitDocument> = mongoose.model(Visit.name, VisitSchema);
    const siteDocs = new Map<string, SiteDocument>();
    for (const item of sites) siteDocs.set(item.address, (await siteModel.findOneAndUpdate({ address: item.address }, item, { upsert: true, new: true, setDefaultsOnInsert: true }))!);
    const personDocs = new Map<string, PersonDocument>();
    for (const item of people) personDocs.set(item.slug, (await personModel.findOneAndUpdate({ slug: item.slug }, item, { upsert: true, new: true, setDefaultsOnInsert: true }))!);
    await visitModel.deleteMany({ seeded: true });
    const trails: Array<[string, string[]]> = [
      ['mara-quinn', ['tidepool.zz', 'observatory.zz', 'night-walks.zz', 'field-recordings.zz', 'garden.zz', 'archive.zz', 'maps-at-dusk.zz']],
      ['jon-bell', ['garden.zz', 'botanical-notes.zz', 'kitchen-table.zz', 'archive.zz', 'tidepool.zz']],
      ['priya-das', ['archive.zz', 'train-stations.zz', 'maps-at-dusk.zz', 'small-museum.zz', 'night-walks.zz', 'archive.zz']],
      ['eli-wren', ['field-recordings.zz', 'tidepool.zz', 'kitchen-table.zz', 'night-walks.zz']],
      ['sana-ortiz', sites.map((item) => item.address)]
    ];
    const base = new Date('2025-03-01T08:00:00.000Z').getTime();
    const visits = trails.flatMap(([personSlug, addresses], personIndex) => addresses.map((address, index) => ({
      personId: personDocs.get(personSlug)!._id,
      address,
      title: siteDocs.get(address)!.title,
      source: index === 0 ? 'typed' : index % 3 === 0 ? 'search' : 'link',
      visitedAt: new Date(base + (personIndex * 11 + index) * 43 * 60 * 1000),
      seeded: true
    })));
    await visitModel.insertMany(visits);
    console.log(`Seeded ${sites.length} sites, ${people.length} people, and ${visits.length} visits.`);
  } finally {
    await mongoose.disconnect();
  }
}

void seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
