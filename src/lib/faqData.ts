export type FaqCategory = 'general' | 'buy' | 'sell' | 'rent' | 'invest' | 'property' | 'mortgage-services' | 'relocation-services' | 'property-management' | 'property-brokerage' | 'commercial-services' | 'industrial-services' | 'interior-design-and-fit-out' | 'real-estate-development' | 'off-plan';

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const faqData: FaqItem[] = [
  // ---------------------------------------------------------
  // GENERAL (Home Page)
  // ---------------------------------------------------------
  {
    category: 'general',
    question: "What areas in Dubai do you specialize in?",
    answer: "We specialize in Dubai's most prestigious and high-yield districts, including Downtown Dubai, Palm Jumeirah, Dubai Marina, Business Bay, Emirates Hills, and exclusive off-market luxury communities."
  },
  {
    category: 'general',
    question: "Do you handle both off-plan and ready properties?",
    answer: "Yes, we offer a highly curated portfolio of both ready-to-move-in luxury residences and exclusive off-plan developments from top-tier developers like Emaar, Nakheel, and Meraas."
  },
  {
    category: 'general',
    question: "How can I schedule a private viewing?",
    answer: "You can schedule a private viewing by contacting our Advisory Desk directly through our Contact page, calling our VIP hotline, or by clicking the 'Inquire' button on any property listing."
  },
  {
    category: 'general',
    question: "Are your agents RERA certified?",
    answer: "Absolutely. Every broker and consultant at Mohd. Alfalasi Real Estate is fully certified by the Real Estate Regulatory Agency (RERA) and undergoes continuous luxury market training."
  },
  {
    category: 'general',
    question: "Do you cater to international clients who cannot visit Dubai?",
    answer: "Yes, we offer end-to-end virtual services for our international clients, including high-definition virtual tours, remote document signing, and digital power of attorney facilitation."
  },
  {
    category: 'general',
    question: "Is Dubai real estate a safe investment?",
    answer: "Dubai is considered one of the safest real estate markets globally, heavily regulated by the Dubai Land Department (DLD) with strict escrow laws protecting investors' funds."
  },
  {
    category: 'general',
    question: "What makes your brokerage different from others?",
    answer: "We focus exclusively on the luxury sector and high-net-worth individuals, offering unmatched discretion, access to off-market inventory, and bespoke advisory services beyond mere transactions."
  },
  {
    category: 'general',
    question: "Can you assist with setting up a bank account in Dubai?",
    answer: "Yes, our concierge team assists clients with setting up local bank accounts, a necessary step for executing property transactions and managing future rental income."
  },
  {
    category: 'general',
    question: "Do you offer post-handover services?",
    answer: "Yes. From key handover and snagging inspections to interior design, DEWA setup, and ongoing property management, we provide a complete turnkey solution."
  },
  {
    category: 'general',
    question: "How often do you update your property listings?",
    answer: "Our portfolio is updated in real-time. Sold or leased properties are immediately flagged or removed, and new exclusive listings are added daily as they come to market."
  },

  // ---------------------------------------------------------
  // BUY
  // ---------------------------------------------------------
  {
    category: 'buy',
    question: "Can foreigners buy property in Dubai?",
    answer: "Yes, foreigners can buy property on a freehold basis in designated areas in Dubai, which encompass almost all major residential and commercial hubs like Dubai Marina, Downtown Dubai, and Palm Jumeirah."
  },
  {
    category: 'buy',
    question: "What are the standard fees when buying property in Dubai?",
    answer: "Buyers typically pay a 4% Dubai Land Department (DLD) transfer fee, a 2% agency fee (+ 5% VAT on the agency fee), and a minor DLD admin fee (approx. AED 4,000 to AED 5,800 depending on property type)."
  },
  {
    category: 'buy',
    question: "What is an NOC and why is it needed?",
    answer: "A No Objection Certificate (NOC) is issued by the developer confirming that all service charges have been paid by the seller. The DLD requires this to transfer the title deed to the new buyer."
  },
  {
    category: 'buy',
    question: "Can I buy property using cryptocurrency?",
    answer: "Yes, many leading developers and private sellers in Dubai accept cryptocurrency. We facilitate these transactions through licensed OTC (Over-The-Counter) crypto brokers who convert it to fiat for the DLD transfer."
  },
  {
    category: 'buy',
    question: "What is the difference between freehold and leasehold?",
    answer: "Freehold means you own the property and the land it stands on indefinitely. Leasehold gives you the right to occupy the property for a fixed term (usually 99 years), but you do not own the land."
  },
  {
    category: 'buy',
    question: "Do I need to be in Dubai to complete the purchase?",
    answer: "No, you do not need to be physically present. You can grant a legally notarized Power of Attorney (POA) to our agency or a legal representative to sign the transfer documents on your behalf."
  },
  {
    category: 'buy',
    question: "What is an Escrow account in Dubai off-plan purchases?",
    answer: "By law, developers must place investors' payments into an approved Escrow account. Funds can only be withdrawn based on verified construction milestones, ensuring buyer protection."
  },
  {
    category: 'buy',
    question: "How long does the buying process take for a secondary market property?",
    answer: "For a cash purchase, the transaction can be completed in as little as 1 to 2 weeks. If financing is involved, it typically takes 4 to 8 weeks depending on the mortgage approval process."
  },
  {
    category: 'buy',
    question: "What is Form F?",
    answer: "Form F is the standard Memorandum of Understanding (MOU) mandated by RERA. It is the legally binding contract signed between the buyer and seller outlining the terms, price, and timeline of the sale."
  },
  {
    category: 'buy',
    question: "Is VAT applicable when buying a property?",
    answer: "Residential properties are largely exempt from VAT. The first supply of a new residential property within 3 years of construction is zero-rated. However, commercial properties are subject to a 5% VAT."
  },

  // ---------------------------------------------------------
  // SELL
  // ---------------------------------------------------------
  {
    category: 'sell',
    question: "How do you determine the correct listing price for my property?",
    answer: "Our senior advisory team conducts a Comparative Market Analysis (CMA), evaluating recent DLD transactions, active market competition, and the unique premium features of your property to determine its optimal price."
  },
  {
    category: 'sell',
    question: "What is an exclusive listing agreement (Form A)?",
    answer: "Form A is the RERA document for an exclusive listing, meaning our agency is the sole representative for your property. This allows us to dedicate our full marketing budget and ensure price consistency."
  },
  {
    category: 'sell',
    question: "What costs am I responsible for as a seller?",
    answer: "Sellers are responsible for clearing their mortgage (if any), paying off outstanding service charges to obtain the NOC, and covering the developer's NOC issuance fee (typically AED 500 to AED 5,000)."
  },
  {
    category: 'sell',
    question: "Do I have to pay capital gains tax when selling?",
    answer: "No. Dubai imposes 0% capital gains tax, meaning you keep 100% of the profit made from the appreciation of your real estate asset."
  },
  {
    category: 'sell',
    question: "How will you market my luxury property?",
    answer: "We utilize cinematic video tours, professional architectural photography, premium placements on top property portals, international luxury real estate networks, and direct pitches to our VIP client database."
  },
  {
    category: 'sell',
    question: "Can I sell my off-plan property before it is finished?",
    answer: "Yes, you can sell off-plan properties (known as flipping). However, developers typically require you to have paid a certain percentage (often 30% to 40%) of the total price before they will issue an NOC for resale."
  },
  {
    category: 'sell',
    question: "How long does it typically take to sell a property?",
    answer: "Properly priced properties in high-demand areas can sell within days or weeks. For ultra-luxury or unique assets, the timeline may be longer as we target a highly specific niche of ultra-high-net-worth buyers."
  },
  {
    category: 'sell',
    question: "What happens if there is a tenant in the property I want to sell?",
    answer: "You can sell a tenanted property. The new buyer will inherit the tenancy contract under the same terms. If the buyer wants it vacant, you must serve the tenant a 12-month notarized eviction notice for the purpose of sale."
  },
  {
    category: 'sell',
    question: "Will you conduct open houses for my property?",
    answer: "For luxury properties, we typically avoid public open houses to maintain security and exclusivity. Instead, we conduct private, qualified viewings by appointment only."
  },
  {
    category: 'sell',
    question: "What documents do I need to list my property?",
    answer: "You will need a copy of the Title Deed, your Passport/Emirates ID, a completed Form A (Broker Agreement), and copies of any existing tenancy contracts if the property is rented."
  },

  // ---------------------------------------------------------
  // RENT
  // ---------------------------------------------------------
  {
    category: 'rent',
    question: "What is Ejari and who pays for it?",
    answer: "Ejari is the mandatory government system for registering rental contracts, protecting the rights of both parties. The registration fee (approx. AED 220) is typically paid by the tenant."
  },
  {
    category: 'rent',
    question: "What is the standard security deposit in Dubai?",
    answer: "The standard security deposit is 5% of the annual rent for unfurnished properties and 10% for furnished properties, refundable at the end of the tenancy minus any damages."
  },
  {
    category: 'rent',
    question: "How are rent payments structured?",
    answer: "Rent is traditionally paid via post-dated cheques. The number of cheques (1, 2, 4, or 12) is negotiated upfront. Alternatively, the DLD has introduced a direct debit system which is becoming increasingly popular."
  },
  {
    category: 'rent',
    question: "Who is responsible for property maintenance?",
    answer: "Minor maintenance (usually under AED 500 per incident) is the tenant's responsibility. Major maintenance (structural, plumbing, AC compressors) is the landlord's responsibility, unless stated otherwise in the contract addendum."
  },
  {
    category: 'rent',
    question: "Can a landlord increase rent whenever they want?",
    answer: "No. Rent increases are strictly governed by the RERA Rental Index. A landlord must provide 90 days' written notice prior to contract expiry if they intend to increase the rent, and it must fall within the RERA allowed parameters."
  },
  {
    category: 'rent',
    question: "What are the fees associated with renting a property?",
    answer: "Tenants pay the first rent installment, the security deposit, a 5% agency fee (+ VAT), Ejari registration, and DEWA (electricity/water) activation fees and deposits."
  },
  {
    category: 'rent',
    question: "What happens if I need to break my lease early?",
    answer: "Breaking a lease early usually incurs a penalty, typically two months' rent, as outlined in your contract addendum. You must also usually provide 30 to 60 days' notice to the landlord."
  },
  {
    category: 'rent',
    question: "Can the landlord evict me without notice?",
    answer: "No. A landlord can only evict a tenant for specific reasons (e.g., selling the property or personal use) and must serve a 12-month notarized eviction notice through the Dubai Courts."
  },
  {
    category: 'rent',
    question: "Do I need a residence visa to rent an apartment?",
    answer: "Yes, you must have a valid UAE Residence Visa and Emirates ID to sign a tenancy contract and register for Ejari and utility services."
  },
  {
    category: 'rent',
    question: "Are pets allowed in rental properties?",
    answer: "This depends entirely on the landlord and the master community's rules. You must explicitly request permission and have a 'Pets Allowed' clause added to your tenancy contract addendum."
  },

  // ---------------------------------------------------------
  // INVEST
  // ---------------------------------------------------------
  {
    category: 'invest',
    question: "What is the average rental yield (ROI) in Dubai?",
    answer: "Dubai offers some of the highest rental yields globally. Depending on the district and property type, gross yields typically range from 5% to 8%, with short-term holiday homes often achieving higher."
  },
  {
    category: 'invest',
    question: "Are there any taxes on my investment returns?",
    answer: "Dubai offers a zero-tax environment for real estate investments. There is 0% tax on rental income and 0% tax on capital gains."
  },
  {
    category: 'invest',
    question: "What is the Golden Visa and how do I qualify?",
    answer: "The UAE Golden Visa is a 10-year renewable residency. Real estate investors qualify if they purchase property (ready or off-plan) valued at a minimum of AED 2,000,000."
  },
  {
    category: 'invest',
    question: "Is it better to invest in off-plan or ready properties?",
    answer: "Off-plan properties often offer lower entry prices and flexible payment plans, great for capital appreciation. Ready properties provide immediate rental income and are better for instant cash flow."
  },
  {
    category: 'invest',
    question: "Can I repatriate my funds easily?",
    answer: "Yes, there are no capital controls in the UAE. You can repatriate 100% of your capital and profits to your home country without any restrictions."
  },
  {
    category: 'invest',
    question: "Should I invest in short-term or long-term rentals?",
    answer: "Long-term rentals offer stability and fewer operational headaches. Short-term rentals (holiday homes) can yield 20-30% higher returns but require active management and are subject to seasonal fluctuations."
  },
  {
    category: 'invest',
    question: "What are service charges, and how do they impact ROI?",
    answer: "Service charges are annual fees paid to the developer for building maintenance. When calculating net ROI, you must deduct the service charges and management fees from your gross rental income."
  },
  {
    category: 'invest',
    question: "What happens if an off-plan project is delayed?",
    answer: "RERA closely monitors construction progress. If a project is delayed, investors' funds remain safe in the Escrow account. Developers face strict penalties, and in rare cancellation cases, funds are refunded to investors."
  },
  {
    category: 'invest',
    question: "Is Dubai's property market a bubble?",
    answer: "Unlike the 2008 era, Dubai's current market is highly regulated, mature, and driven by end-users and long-term residents rather than short-term speculators. DLD regulations ensure sustainable growth."
  },
  {
    category: 'invest',
    question: "Do you offer portfolio management for multiple properties?",
    answer: "Yes, we provide holistic portfolio management for large-scale investors, handling acquisitions, optimization, tenant management, and strategic liquidation to maximize overall portfolio yield."
  },

  // ---------------------------------------------------------
  // PROPERTY (Details Page)
  // ---------------------------------------------------------
  {
    category: 'property',
    question: "Are service charges included in the listed price?",
    answer: "For buyers, the listed price is for the property only; annual service charges are billed separately by the developer. For renters, service charges are already covered by the landlord."
  },
  {
    category: 'property',
    question: "Can I schedule a virtual tour of this property?",
    answer: "Yes, our advisory desk can arrange a comprehensive, high-definition virtual walk-through if you are unable to view the property in person."
  },
  {
    category: 'property',
    question: "Is this property available for immediate move-in?",
    answer: "If the property is marked as 'Vacant on Transfer' (VOT) or 'Ready', it is available immediately upon completion of the DLD transfer or Ejari registration."
  },
  {
    category: 'property',
    question: "What amenities are included in this building/community?",
    answer: "You can find a detailed list of amenities in the 'Specifications' section of this listing. Luxury properties typically include concierge services, state-of-the-art gyms, infinity pools, and valet parking."
  },
  {
    category: 'property',
    question: "Is the price negotiable?",
    answer: "While luxury property prices reflect their premium market value, our expert brokers can advise you on realistic negotiation strategies based on the seller's circumstances and recent transactions in the same building."
  },
  {
    category: 'property',
    question: "Does this property come furnished?",
    answer: "The furnishing status is specified in the property details. If it is furnished, it typically includes high-end, bespoke designer furniture. Unfurnished properties usually come with fully fitted kitchens and appliances."
  },
  {
    category: 'property',
    question: "Are pets allowed in this property?",
    answer: "Pet policies vary by building and master community. While many luxury villa communities are pet-friendly, some apartment towers have restrictions. Please inquire directly about this specific property."
  },
  {
    category: 'property',
    question: "What is the parking situation?",
    answer: "Luxury apartments generally come with 1 to 3 allocated basement parking spaces depending on the size. Villas typically feature private garages for 2 or more vehicles."
  },
  {
    category: 'property',
    question: "How much are the exact annual service charges?",
    answer: "Service charges fluctuate slightly year-by-year based on developer audits. Please contact our agent to request the most recent service charge invoice for this exact unit."
  },
  {
    category: 'property',
    question: "Is this property eligible for the Golden Visa?",
    answer: "If the listing price exceeds AED 2,000,000 and you retain the property, it generally qualifies the buyer to apply for the UAE 10-year Golden Visa."
  },

  // ---------------------------------------------------------
  // MORTGAGE SERVICES
  // ---------------------------------------------------------
  {
    category: 'mortgage-services',
    question: "Can non-residents get a mortgage in Dubai?",
    answer: "Yes. While residents can typically borrow up to 80%, non-residents can secure mortgages covering up to 50% to 60% of the property value, depending on the bank and the client's financial profile."
  },
  {
    category: 'mortgage-services',
    question: "What is the minimum down payment for a resident?",
    answer: "For expats purchasing their first property, the minimum down payment is 20% for properties under AED 5 million, and 30% for properties over AED 5 million. UAE Nationals have lower down payment requirements."
  },
  {
    category: 'mortgage-services',
    question: "Fixed vs Variable rate: Which is better in Dubai?",
    answer: "Fixed rates (usually locked for 1 to 5 years) offer stability against market fluctuations. Variable rates are tied to the EIBOR (Emirates Interbank Offered Rate). Our advisors help you choose based on macroeconomic trends."
  },
  {
    category: 'mortgage-services',
    question: "How long does mortgage pre-approval take?",
    answer: "With our dedicated financial partners, a mortgage pre-approval can typically be secured within 3 to 5 working days, provided all required financial documents are submitted."
  },
  {
    category: 'mortgage-services',
    question: "Are there age limits for securing a mortgage?",
    answer: "Yes, the maximum age to complete a mortgage repayment is usually 65 years for salaried employees and 70 years for self-employed individuals."
  },
  {
    category: 'mortgage-services',
    question: "What are the costs associated with getting a mortgage?",
    answer: "Common fees include a bank arrangement fee (usually 1%), a property valuation fee (approx. AED 2,500 - AED 3,500), and a DLD mortgage registration fee (0.25% of the loan amount)."
  },
  {
    category: 'mortgage-services',
    question: "Can I get a mortgage for an off-plan property?",
    answer: "Yes, off-plan mortgages are available but usually require the developer to have completed at least 50% of the construction, and the buyer must have paid off their entire down payment portion."
  },
  {
    category: 'mortgage-services',
    question: "What is Debt Burden Ratio (DBR)?",
    answer: "The UAE Central Bank mandates that your total monthly debt obligations (including the new mortgage, car loans, credit cards) cannot exceed 50% of your monthly income."
  },
  {
    category: 'mortgage-services',
    question: "Do I have to buy life insurance with my mortgage?",
    answer: "Yes, life insurance is mandatory for mortgages in the UAE to protect the bank in case of death. You can either use the bank's policy or assign an external policy."
  },
  {
    category: 'mortgage-services',
    question: "Can I pay off my mortgage early?",
    answer: "Yes, you can make early settlements. The UAE Central Bank caps the early settlement penalty at 1% of the outstanding amount or AED 10,000, whichever is lower."
  },

  // ---------------------------------------------------------
  // RELOCATION SERVICES
  // ---------------------------------------------------------
  {
    category: 'relocation-services',
    question: "Do you handle UAE residence visa processing?",
    answer: "Yes, our concierge team assists with securing Golden Visas, Investor Visas, and family sponsorships as part of our comprehensive relocation packages."
  },
  {
    category: 'relocation-services',
    question: "Can you help me find schools for my children?",
    answer: "Absolutely. We offer tailored school search services, arranging campus tours, assisting with enrollment applications, and finding luxury homes within proximity to Dubai's top-tier international schools."
  },
  {
    category: 'relocation-services',
    question: "Do you assist with international moving and shipping?",
    answer: "We partner with premium, white-glove international logistics firms to handle the packing, shipping, customs clearance, and unpacking of your belongings."
  },
  {
    category: 'relocation-services',
    question: "How do you help with neighborhood selection?",
    answer: "We conduct detailed lifestyle consultations to understand your preferences regarding commute, schools, leisure, and privacy, matching you with exclusive communities that fit your exact needs."
  },
  {
    category: 'relocation-services',
    question: "Can you assist with pet relocation?",
    answer: "Yes, we work with specialized pet relocation agencies to navigate UAE import regulations, vaccinations, and quarantine requirements to bring your pets safely to Dubai."
  },
  {
    category: 'relocation-services',
    question: "Do you help set up utilities and internet?",
    answer: "As part of our handover process, we manage all utility connections on your behalf, including DEWA (water and electricity), district cooling (e.g., Empower), and high-speed internet setup."
  },
  {
    category: 'relocation-services',
    question: "Can you arrange temporary luxury accommodation?",
    answer: "Yes, while you are finalizing your long-term purchase or rental, we can place you in premium serviced apartments or luxury short-term villas."
  },
  {
    category: 'relocation-services',
    question: "Do you provide orientation tours of Dubai?",
    answer: "Our advisory team provides bespoke orientation tours, familiarizing you with key districts, healthcare facilities, dining hotspots, and business hubs."
  },
  {
    category: 'relocation-services',
    question: "Can you assist with setting up a business in Dubai?",
    answer: "Yes, through our network of corporate service providers, we can seamlessly facilitate mainland or freezone company formations alongside your personal relocation."
  },
  {
    category: 'relocation-services',
    question: "How early should I contact you before moving?",
    answer: "We recommend engaging our relocation services 2 to 3 months prior to your intended move date to ensure a stress-free transition, especially regarding school admissions and visa processing."
  },

  // ---------------------------------------------------------
  // PROPERTY MANAGEMENT
  // ---------------------------------------------------------
  {
    category: 'property-management',
    question: "What is included in your property management service?",
    answer: "Our elite service covers marketing, tenant screening, lease drafting, Ejari registration, rent collection, 24/7 maintenance handling, and detailed quarterly financial reporting."
  },
  {
    category: 'property-management',
    question: "How do you screen potential tenants?",
    answer: "We conduct rigorous background checks, verifying employment, income stability, rental history, and passport/visa validity to ensure we place high-quality, reliable tenants in your premium asset."
  },
  {
    category: 'property-management',
    question: "Who handles maintenance emergencies?",
    answer: "Our dedicated 24/7 facility management team handles all emergencies. We ensure swift resolution to protect your property and keep your tenants satisfied."
  },
  {
    category: 'property-management',
    question: "How are your property management fees structured?",
    answer: "We charge a competitive percentage of the annual rental amount (typically around 5%), which is easily offset by minimizing vacancy periods and preventing costly property damage through proactive care."
  },
  {
    category: 'property-management',
    question: "What happens if a tenant bounces a cheque?",
    answer: "Our legal support team handles cheque defaults immediately, issuing legal notices, negotiating resolutions, and, if necessary, initiating eviction proceedings through the Dubai Rental Dispute Center."
  },
  {
    category: 'property-management',
    question: "Do you manage short-term holiday homes?",
    answer: "Yes, we have a specialized division for premium short-term rentals, handling pricing optimization, housekeeping, guest vetting, and DTCM compliance to maximize your yields."
  },
  {
    category: 'property-management',
    question: "How do I keep track of my property's financial performance?",
    answer: "You will receive secure, detailed financial statements showing all income, maintenance expenses, and net yields, keeping you completely informed from anywhere in the world."
  },
  {
    category: 'property-management',
    question: "Do you handle move-in and move-out inspections?",
    answer: "Yes. We conduct thorough snagging and inventory checks with photographic evidence at both move-in and move-out to ensure your property remains in pristine condition and to manage deposit deductions fairly."
  },
  {
    category: 'property-management',
    question: "Can I use my own preferred maintenance contractors?",
    answer: "While we highly recommend our vetted network for guaranteed quality and response times, we are happy to coordinate with your preferred contractors if required."
  },
  {
    category: 'property-management',
    question: "Do you manage property portfolios across different emirates?",
    answer: "While our core focus is luxury properties in Dubai, we do manage extensive portfolios for VIP clients that span across prime locations in Abu Dhabi and Ras Al Khaimah."
  },

  // ---------------------------------------------------------
  // PROPERTY BROKERAGE
  // ---------------------------------------------------------
  {
    category: 'property-brokerage',
    question: "What makes your brokerage service 'premium'?",
    answer: "We offer absolute discretion, access to unlisted off-market assets, personalized data-driven advisory, and white-glove service that handles every aspect of the transaction from negotiation to handover."
  },
  {
    category: 'property-brokerage',
    question: "Do you represent buyers or sellers?",
    answer: "We offer both seller representation (listing agents) and buyer representation (buyer's agents), ensuring that regardless of which side you are on, your financial interests are fiercely protected."
  },
  {
    category: 'property-brokerage',
    question: "How do I access your off-market properties?",
    answer: "Due to the privacy of our ultra-high-net-worth clients, off-market properties are not published online. You can access them by scheduling a private consultation with our senior advisory team."
  },
  {
    category: 'property-brokerage',
    question: "Will you accompany me to viewings?",
    answer: "Yes. Your dedicated luxury broker will accompany you to all viewings, providing expert insights into the property's construction, community plans, and investment viability."
  },
  {
    category: 'property-brokerage',
    question: "Do you assist with price negotiations?",
    answer: "Negotiation is our core strength. We utilize comprehensive market data, recent transaction history, and our deep understanding of seller psychology to secure the most favorable terms for our clients."
  },
  {
    category: 'property-brokerage',
    question: "What is a buyer's agency agreement?",
    answer: "It is an agreement where you retain our firm exclusively to source, negotiate, and secure a property for you. This allows us to search the entire market, including competitor listings, on your behalf."
  },
  {
    category: 'property-brokerage',
    question: "How transparent are your fees?",
    answer: "We operate with 100% transparency. Standard brokerage fees are 2% (+ VAT). There are no hidden costs, and all government fees are clearly outlined before you sign any agreement."
  },
  {
    category: 'property-brokerage',
    question: "Can you advise on the best areas for capital appreciation?",
    answer: "Absolutely. Our research team constantly analyzes market trends, upcoming infrastructure projects, and supply pipelines to advise you on districts primed for significant capital growth."
  },
  {
    category: 'property-brokerage',
    question: "Do you offer post-purchase support?",
    answer: "Our relationship doesn't end at the transaction. We assist with DEWA connections, developer handovers, interior design introductions, and seamless transition into our property management services."
  },
  {
    category: 'property-brokerage',
    question: "Are your brokers specialized in specific areas?",
    answer: "Yes, our firm operates on a 'specialist model.' Our brokers focus exclusively on specific luxury communities (e.g., Palm Jumeirah specialists), ensuring they possess unmatched micro-market knowledge."
  },

  // ---------------------------------------------------------
  // COMMERCIAL SERVICES
  // ---------------------------------------------------------
  {
    category: 'commercial-services',
    question: "Do you assist with leasing office space?",
    answer: "Yes, we provide bespoke brokerage for prime commercial real estate, helping corporations secure Grade-A office spaces in hubs like DIFC, Downtown Dubai, and Business Bay."
  },
  {
    category: 'commercial-services',
    question: "What is the difference between Freezone and Mainland offices?",
    answer: "Mainland offices allow you to trade anywhere in the UAE and require a DED license. Freezone offices (like DMCC or DIFC) allow 100% foreign ownership but restrict trading within the UAE mainland."
  },
  {
    category: 'commercial-services',
    question: "Can you negotiate fit-out grace periods?",
    answer: "Absolutely. We heavily negotiate lease terms, commonly securing 1 to 3 months of rent-free periods to allow your company time to complete interior fit-outs before rent commences."
  },
  {
    category: 'commercial-services',
    question: "Do you handle bulk corporate housing for employees?",
    answer: "Yes, we specialize in securing bulk residential units for corporate executives and staff, ensuring proximity to offices and negotiating favorable corporate lease terms."
  },
  {
    category: 'commercial-services',
    question: "What is the standard lease term for commercial properties?",
    answer: "Commercial leases in Dubai are typically signed for 1 to 5 years. Longer leases offer more room to negotiate rent-free periods and locked-in rates."
  },
  {
    category: 'commercial-services',
    question: "Are there service charges for commercial properties?",
    answer: "Yes, commercial tenants usually pay a service charge (calculated per square foot) which covers the maintenance of common areas, security, and building cooling."
  },
  {
    category: 'commercial-services',
    question: "Do you offer commercial property valuation?",
    answer: "We provide comprehensive commercial valuations based on yield analysis, location, and asset class to ensure you are paying or asking the correct market rate."
  },
  {
    category: 'commercial-services',
    question: "Can you assist with retail space acquisition?",
    answer: "Yes, our commercial division secures prime retail locations, from high-street boutiques to F&B spaces in luxury developments and malls."
  },
  {
    category: 'commercial-services',
    question: "What is Ejari for business?",
    answer: "Just like residential, all commercial leases must be registered with Ejari. You cannot obtain or renew your company's Trade License without a valid commercial Ejari certificate."
  },
  {
    category: 'commercial-services',
    question: "Do you sell entire commercial buildings?",
    answer: "Yes, we facilitate large-scale acquisitions of full commercial buildings, hotels, and retail centers for institutional investors and family offices."
  },

  // ---------------------------------------------------------
  // INDUSTRIAL SERVICES
  // ---------------------------------------------------------
  {
    category: 'industrial-services',
    question: "What types of industrial properties do you handle?",
    answer: "We specialize in securing warehouses, logistics hubs, labor camps, factories, and industrial land across major zones like JAFZA, Dubai Industrial City (DIC), and Al Quoz."
  },
  {
    category: 'industrial-services',
    question: "Can you help with power load requirements?",
    answer: "Yes, verifying available electrical load (measured in kW) is critical for manufacturing. We cross-check DEWA capacities to ensure the facility meets your operational requirements."
  },
  {
    category: 'industrial-services',
    question: "What is the DCD approval?",
    answer: "Dubai Civil Defence (DCD) approval is mandatory for industrial properties to ensure fire safety compliance. We guide clients toward properties that already meet their specific DCD risk classifications."
  },
  {
    category: 'industrial-services',
    question: "Do you facilitate built-to-suit industrial projects?",
    answer: "Yes, we advise on built-to-suit logistics facilities, negotiating long-term land leases and coordinating with developers to build warehouses tailored to your exact supply chain needs."
  },
  {
    category: 'industrial-services',
    question: "What are the rules for labor accommodation?",
    answer: "Labor camps are strictly regulated by the Ministry of Human Resources and Emiratisation (MOHRE). We ensure the properties we source meet all health, space, and safety compliance standards."
  },
  {
    category: 'industrial-services',
    question: "Are industrial properties freehold or leasehold?",
    answer: "Most industrial land in Dubai is leasehold (often 10, 15, or 30-year leases from the government or freezone authority), though some freehold industrial options are emerging."
  },
  {
    category: 'industrial-services',
    question: "Can you assist with open yard storage?",
    answer: "Yes, we source open yard plots for heavy machinery, vehicle storage, and construction materials in zones like Jebel Ali and Dubai South."
  },
  {
    category: 'industrial-services',
    question: "How do Freezone customs benefits affect property choice?",
    answer: "Locating in a Freezone like JAFZA offers customs duties exemptions for re-exporting. We align your property search with your company's import/export strategy to maximize tax efficiency."
  },
  {
    category: 'industrial-services',
    question: "What is the standard ceiling height for a modern logistics warehouse?",
    answer: "Modern logistics hubs typically require an eaves height of 9 to 12 meters to accommodate multi-tier racking systems. We filter properties based on your volumetric requirements."
  },
  {
    category: 'industrial-services',
    question: "Is there a sub-leasing fee in Freezones?",
    answer: "Yes, if you sublease an industrial property within a Freezone, the authority usually charges a sub-leasing fee (often a percentage of the rent). We factor this into your financial models."
  },

  // ---------------------------------------------------------
  // INTERIOR DESIGN & FIT OUT
  // ---------------------------------------------------------
  {
    category: 'interior-design-and-fit-out',
    question: "Do you offer turnkey interior design solutions?",
    answer: "Yes, we provide end-to-end services, from conceptual 3D renders and space planning to bespoke furniture procurement and full architectural fit-outs for luxury residences."
  },
  {
    category: 'interior-design-and-fit-out',
    question: "Do you handle all necessary government approvals?",
    answer: "Absolutely. We handle all NOCs from developers and approvals from Dubai Municipality and Dubai Civil Defence, ensuring your renovations are 100% legal and compliant."
  },
  {
    category: 'interior-design-and-fit-out',
    question: "How long does a luxury fit-out typically take?",
    answer: "A full luxury villa renovation can take between 3 to 6 months depending on the scope of structural changes, while apartment upgrades typically take 6 to 12 weeks."
  },
  {
    category: 'interior-design-and-fit-out',
    question: "Can interior upgrades increase my property's ROI?",
    answer: "Significantly. Premium, modern fit-outs can increase rental yields by 15-25% and drastically improve capital appreciation when flipping properties in the secondary market."
  },
  {
    category: 'interior-design-and-fit-out',
    question: "Do you source bespoke and designer furniture?",
    answer: "Yes, our procurement team sources exclusive pieces from top European design houses and commissions bespoke, locally crafted furniture tailored to your exact space."
  },
  {
    category: 'interior-design-and-fit-out',
    question: "Can I see a 3D rendering before construction begins?",
    answer: "Yes. Our design process includes hyper-realistic 3D walkthroughs, allowing you to visualize and tweak the layout, lighting, and materials before any physical work starts."
  },
  {
    category: 'interior-design-and-fit-out',
    question: "Do you handle smart home integration?",
    answer: "Smart home automation is a core component of our luxury fit-outs. We seamlessly integrate climate, lighting, security, and AV systems into a centralized, easy-to-use interface."
  },
  {
    category: 'interior-design-and-fit-out',
    question: "Are your contractors certified and insured?",
    answer: "We only partner with Tier-1, fully licensed and insured contracting firms in Dubai, ensuring the highest standards of craftsmanship and health & safety compliance."
  },
  {
    category: 'interior-design-and-fit-out',
    question: "Can you renovate a property while I am living abroad?",
    answer: "Yes. We act as your dedicated project managers, providing weekly video updates, timeline tracking, and transparent budget reporting so you can oversee the project from anywhere."
  },
  {
    category: 'interior-design-and-fit-out',
    question: "Do you provide warranties on fit-out work?",
    answer: "Yes, all our interior and MEP (Mechanical, Electrical, Plumbing) works come with a standard 12-month defect liability period to guarantee long-lasting quality."
  },

  // ---------------------------------------------------------
  // REAL ESTATE DEVELOPMENT
  // ---------------------------------------------------------
  {
    category: 'real-estate-development',
    question: "Do you advise on land acquisition for development?",
    answer: "Yes, we specialize in sourcing prime plots for residential and commercial development, analyzing zoning regulations (G+ constraints), FAR (Floor Area Ratio), and land valuations."
  },
  {
    category: 'real-estate-development',
    question: "What is a feasibility study in real estate?",
    answer: "We conduct rigorous financial modeling, projecting construction costs, market absorption rates, and expected GDV (Gross Development Value) to ensure your project is highly profitable."
  },
  {
    category: 'real-estate-development',
    question: "How do developers launch off-plan projects in Dubai?",
    answer: "Developers must own the land completely, secure a bank guarantee, and open a DLD-approved Escrow account before they are permitted to sell off-plan units to the public."
  },
  {
    category: 'real-estate-development',
    question: "Can you assist with appointing architects and contractors?",
    answer: "Yes, our advisory extends to running competitive tenders to appoint world-class lead consultants, architects, and main contractors suited for luxury developments."
  },
  {
    category: 'real-estate-development',
    question: "Do you offer sales and marketing strategy for new developments?",
    answer: "Absolutely. We design the go-to-market strategy, creating brand identity, pricing matrices, and leveraging our broker network to sell out projects rapidly."
  },
  {
    category: 'real-estate-development',
    question: "What is the role of RERA in development?",
    answer: "RERA regulates the relationship between developers and buyers, auditing construction progress before authorizing the release of funds from the project's Escrow account."
  },
  {
    category: 'real-estate-development',
    question: "What is OQOOD?",
    answer: "OQOOD is the DLD's online portal for registering off-plan property sales. It protects buyers by officially recording their purchase before the physical title deed is issued upon completion."
  },
  {
    category: 'real-estate-development',
    question: "How do you manage construction risks?",
    answer: "We mitigate risks through strict contract structuring (FIDIC forms), milestone-based payment schedules, and independent project monitoring to ensure timelines and budgets are met."
  },
  {
    category: 'real-estate-development',
    question: "Can family offices partner on developments?",
    answer: "Yes, we regularly structure Joint Ventures (JVs) matching landowners with capital partners or developers to bring high-yield projects to fruition without bearing all the risk."
  },
  {
    category: 'real-estate-development',
    question: "What happens during the handover phase?",
    answer: "We manage the critical handover phase, ensuring snagging is resolved, Building Completion Certificates (BCC) are secured, and the transition to Facility Management is seamless."
  },
  {
    category: 'off-plan',
    question: "What is an off plan property?",
    answer: "An off plan property is bought directly from the developer before construction is complete. Buyers typically secure a lower entry price and pay in instalments during construction, with the balance due on or after handover."
  },
  {
    category: 'off-plan',
    question: "How do off plan payment plans work in Dubai?",
    answer: "Most developers ask for a 10-20% down payment, followed by instalments linked to construction milestones. Many projects offer 60/40 or 50/50 splits, and some include post-handover plans that spread payments over several years after you receive the keys."
  },
  {
    category: 'off-plan',
    question: "Is my money protected when buying off plan?",
    answer: "Yes. Every off plan project in Dubai must be registered with the Dubai Land Department (DLD) and RERA, and buyer payments go into a regulated escrow account that the developer can only draw from as construction progresses."
  },
  {
    category: 'off-plan',
    question: "What fees should I budget for besides the purchase price?",
    answer: "Plan for the 4% DLD registration fee, an Oqood registration fee for off plan contracts, and agency fees where applicable. Service charges start once the building is handed over."
  },
  {
    category: 'off-plan',
    question: "Can foreigners buy off plan property in Dubai?",
    answer: "Yes. Foreign nationals can buy freehold off plan property in designated areas such as Downtown Dubai, Dubai Hills Estate, Dubai Marina, Palm Jumeirah and Mohammed Bin Rashid City."
  },
  {
    category: 'off-plan',
    question: "How do I choose the right developer?",
    answer: "Look at the developer's delivery history, handover record, build quality in completed communities and the long-term demand in the area. Our advisors can share track records and availability for each developer listed on this page."
  }
];

export function getFaqsByCategory(category: string) {
  return faqData.filter(faq => faq.category === category);
}

export function getAllFaqsGrouped() {
  const grouped: Record<string, FaqItem[]> = {};
  faqData.forEach(faq => {
    if (!grouped[faq.category]) {
      grouped[faq.category] = [];
    }
    grouped[faq.category].push(faq);
  });
  return grouped;
}
