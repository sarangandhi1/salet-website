# DNS setup for salet.uk

State of play, checked 5 Jul 2026: salet.uk uses Namecheap's DNS (dns1/dns2.registrar-servers.com). The apex A record and www CNAME currently point at Namecheap's parking page. Email for saran@salet.uk runs on Namecheap Private Email and must not be disturbed.

## Do not touch (mail records, verified live 5 Jul 2026)

| Type | Host | Value | Purpose |
|---|---|---|---|
| MX | @ | mx1.privateemail.com (priority 10) | Incoming mail |
| MX | @ | mx2.privateemail.com (priority 10) | Incoming mail |
| TXT | @ | `v=spf1 include:spf.privateemail.com ~all` | SPF (stops spoofing/lets your mail deliver) |

No DKIM record was found at `default._domainkey.salet.uk` and no DMARC record exists. Both are worth adding for deliverability, via Namecheap Private Email's control panel, but that is separate homework, not part of this cutover. [TODO: enable DKIM in Private Email settings; add a DMARC record after]

## Records to change (only these two)

After the site is deployed to Cloudflare Pages you will have a deployment URL of the form `<project>.pages.dev` [TODO: insert the actual URL after Stage 3 deploy].

In Namecheap → Domain List → salet.uk → Advanced DNS:

1. **Delete** the existing A record: Host `@` → 192.64.119.40 (the parking page).
2. **Delete** the existing CNAME/URL record for Host `www` → parkingpage.namecheap.com.
3. **Add** ALIAS record: Host `@`, value `<project>.pages.dev`, TTL automatic. (Namecheap supports ALIAS at the apex; if the ALIAS type is not offered on your plan, use Cloudflare Pages' "custom domain" IP instructions instead, shown in the Pages dashboard when you add salet.uk.)
4. **Add** CNAME record: Host `www`, value `<project>.pages.dev`, TTL automatic.

Then in the Cloudflare Pages project → Custom domains → add both `salet.uk` and `www.salet.uk`. Cloudflare will verify and issue certificates automatically.

Leave every MX and TXT record exactly as it is.

## Alternative (better long term, more moving parts)

Move the domain's DNS to Cloudflare entirely (free): add salet.uk as a zone in the Cloudflare account, let it import records, then change the nameservers at Namecheap to the pair Cloudflare assigns. Before switching, confirm the imported zone contains the two MX records and the SPF TXT above, exactly. Mail breaks if they are lost in the move. This route makes the Pages custom-domain step one click and gives you Cloudflare's caching and analytics; it is not required for launch.

## Verifying propagation

From any terminal:

```sh
dig +short A salet.uk          # should stop returning 192.64.119.40
dig +short CNAME www.salet.uk  # should return <project>.pages.dev
dig +short MX salet.uk         # must STILL return mx1/mx2.privateemail.com
dig +short TXT salet.uk        # must STILL include v=spf1 include:spf.privateemail.com
```

Or use https://dnschecker.org for a worldwide view. Propagation is usually minutes at Namecheap's default TTL, worst case a few hours. Final check: send an email to saran@salet.uk from another account and confirm it arrives, then load https://salet.uk and https://www.salet.uk in a private browser window.
