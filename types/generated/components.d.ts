import type { Schema, Attribute } from '@strapi/strapi';

export interface BlocksAmenity extends Schema.Component {
  collectionName: 'components_blocks_amenities';
  info: {
    displayName: 'amenity';
  };
  attributes: {
    icon: Attribute.Media;
    name: Attribute.String;
  };
}

export interface BlocksArticleHeadImg extends Schema.Component {
  collectionName: 'components_blocks_article_head_imgs';
  info: {
    displayName: 'articleHeadImg';
  };
  attributes: {
    mobile: Attribute.Media;
    tablet: Attribute.Media;
    desktop: Attribute.Media;
  };
}

export interface BlocksArticlePreview extends Schema.Component {
  collectionName: 'components_blocks_article_previews';
  info: {
    displayName: 'articlePreview';
    icon: 'cube';
  };
  attributes: {
    text: Attribute.Text;
    mobile: Attribute.Media;
    tablet: Attribute.Media;
    desktop: Attribute.Media;
  };
}

export interface BlocksBlogFilter extends Schema.Component {
  collectionName: 'components_blocks_blog_filters';
  info: {
    displayName: 'blogFilter';
    icon: 'cube';
    description: '';
  };
  attributes: {
    buttonFromLink: Attribute.Component<'shared.link', true>;
    title: Attribute.String;
  };
}

export interface BlocksContactCard extends Schema.Component {
  collectionName: 'components_blocks_contact_cards';
  info: {
    displayName: 'contactCard';
    icon: 'cube';
    description: '';
  };
  attributes: {
    heading: Attribute.String;
    subHeading: Attribute.String;
    contactCardIcon: Attribute.Media;
    title: Attribute.String;
    buttonFromLink: Attribute.Component<'shared.link'>;
  };
}

export interface BlocksContactFormLabel extends Schema.Component {
  collectionName: 'components_blocks_contact_form_labels';
  info: {
    displayName: 'contactFormLabel';
    icon: 'cube';
    description: '';
  };
  attributes: {
    labelTitle: Attribute.String;
    inputType: Attribute.String;
    inputId: Attribute.String;
  };
}

export interface BlocksContactForm extends Schema.Component {
  collectionName: 'components_blocks_contact_forms';
  info: {
    displayName: 'contactForm';
    icon: 'cube';
    description: '';
  };
  attributes: {
    contactFormLabel: Attribute.Component<'blocks.contact-form-label', true>;
    buttonFromLink: Attribute.Component<'shared.link'>;
    title: Attribute.String;
    heading: Attribute.String;
  };
}

export interface BlocksFaqItem extends Schema.Component {
  collectionName: 'components_blocks_faq_items';
  info: {
    displayName: 'faqItem';
    description: '';
  };
  attributes: {
    question: Attribute.String;
    answer: Attribute.Text;
    faqIcon: Attribute.Media;
  };
}

export interface BlocksFooterNav extends Schema.Component {
  collectionName: 'components_blocks_footer_navs';
  info: {
    displayName: 'footerNav';
  };
  attributes: {
    links: Attribute.Relation<
      'blocks.footer-nav',
      'oneToMany',
      'api::nav-link.nav-link'
    >;
  };
}

export interface BlocksListingContact extends Schema.Component {
  collectionName: 'components_blocks_listing_contacts';
  info: {
    displayName: 'listingContact';
    icon: 'cube';
    description: '';
  };
  attributes: {
    tourOptions: Attribute.Component<'blocks.tour-options'>;
  };
}

export interface BlocksListingDetailsBody extends Schema.Component {
  collectionName: 'components_sections_listing_details_bodies';
  info: {
    displayName: 'listingDetailsBody';
    icon: 'cube';
    description: '';
  };
  attributes: {
    propDesc: Attribute.Text;
    galleryImages: Attribute.Media;
    amenity: Attribute.Component<'blocks.amenity', true>;
    embeddedGoogleMap: Attribute.Text;
  };
}

export interface BlocksListingDetails extends Schema.Component {
  collectionName: 'components_sections_listing_details';
  info: {
    displayName: 'listingDetailsHead';
    icon: 'cube';
    description: '';
  };
  attributes: {
    listingInfo: Attribute.Component<'blocks.listing-info'>;
    listingTags: Attribute.Component<'sections.listing-tags'>;
  };
}

export interface BlocksListingFilter extends Schema.Component {
  collectionName: 'components_blocks_listing_filters';
  info: {
    displayName: 'listingFilter';
    icon: 'cube';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    search: Attribute.Component<'blocks.search'>;
    select: Attribute.Component<'blocks.select', true>;
    dropDownIcon: Attribute.Media;
    moreFilterOptions: Attribute.Component<'shared.more-filter-options'>;
    searchBtn: Attribute.Component<'shared.link'>;
    sort: Attribute.Component<'blocks.select'>;
    pagination: Attribute.Component<'blocks.select'>;
  };
}

export interface BlocksListingFormField extends Schema.Component {
  collectionName: 'components_blocks_listing_form_fields';
  info: {
    displayName: 'listingFormField';
    icon: 'cube';
    description: '';
  };
  attributes: {
    labelTitle: Attribute.String;
    inputType: Attribute.String;
    inputId: Attribute.String;
    inputName: Attribute.String;
  };
}

export interface BlocksListingInfo extends Schema.Component {
  collectionName: 'components_blocks_listing_infos';
  info: {
    displayName: 'listingInfo';
  };
  attributes: {
    listingTitle: Attribute.String;
    listingLocation: Attribute.String;
  };
}

export interface BlocksListingProps extends Schema.Component {
  collectionName: 'components_blocks_listing_props';
  info: {
    displayName: 'listingProps';
    description: '';
  };
  attributes: {
    listingPropNumber: Attribute.Integer & Attribute.Required;
    listingPropType: Attribute.String;
    listingPropIcon: Attribute.Media & Attribute.Required;
  };
}

export interface BlocksOption extends Schema.Component {
  collectionName: 'components_blocks_options';
  info: {
    displayName: 'option';
  };
  attributes: {
    icon: Attribute.Media;
    text: Attribute.String;
  };
}

export interface BlocksSearch extends Schema.Component {
  collectionName: 'components_blocks_searches';
  info: {
    displayName: 'search';
  };
  attributes: {
    icon: Attribute.Media;
    placeholderText: Attribute.String;
  };
}

export interface BlocksSelect extends Schema.Component {
  collectionName: 'components_blocks_selects';
  info: {
    displayName: 'select';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    sortOptions: Attribute.Relation<
      'blocks.select',
      'oneToMany',
      'api::sort-option.sort-option'
    >;
    filterOptions: Attribute.Relation<
      'blocks.select',
      'oneToMany',
      'api::filter-option.filter-option'
    >;
  };
}

export interface BlocksTourOptions extends Schema.Component {
  collectionName: 'components_blocks_tour_options';
  info: {
    displayName: 'tourOptions';
  };
  attributes: {
    inPersonLabel: Attribute.String;
    videoChatLabel: Attribute.String;
  };
}

export interface GlobalBanner extends Schema.Component {
  collectionName: 'components_global_banners';
  info: {
    displayName: 'Banner';
    icon: 'cube';
    description: '';
  };
  attributes: {
    currencySwitch: Attribute.Component<'shared.currency'>;
    bannerText: Attribute.String;
    link: Attribute.Relation<
      'global.banner',
      'oneToOne',
      'api::nav-link.nav-link'
    >;
  };
}

export interface GlobalCopyright extends Schema.Component {
  collectionName: 'components_global_copyrights';
  info: {
    displayName: 'copyright';
    icon: 'stack';
    description: '';
  };
  attributes: {
    companyCopy: Attribute.String;
    agencyLink: Attribute.Relation<
      'global.copyright',
      'oneToOne',
      'api::nav-link.nav-link'
    >;
  };
}

export interface GlobalNavigation extends Schema.Component {
  collectionName: 'components_global_navigations';
  info: {
    displayName: 'Navigation';
    description: '';
    icon: 'cube';
  };
  attributes: {
    navLogoMobile: Attribute.Media & Attribute.Required;
    navLogoDesktop: Attribute.Media & Attribute.Required;
    menuIcon: Attribute.Media & Attribute.Required;
    navLinks: Attribute.Relation<
      'global.navigation',
      'oneToMany',
      'api::nav-link.nav-link'
    >;
  };
}

export interface SectionsAdditionalDetails extends Schema.Component {
  collectionName: 'components_sections_additional_details';
  info: {
    displayName: 'additionalDetails';
  };
  attributes: {
    dropDownText: Attribute.String;
  };
}

export interface SectionsContact extends Schema.Component {
  collectionName: 'components_sections_contacts';
  info: {
    displayName: 'askUs';
    icon: 'cube';
    description: '';
  };
  attributes: {
    heading: Attribute.Component<'shared.header'>;
    phoneNumber: Attribute.String;
    buttonFromLink: Attribute.Component<'shared.link'> & Attribute.Required;
    callNowIcon: Attribute.Media;
    mobilePhoneIcon: Attribute.Media;
    title: Attribute.String;
  };
}

export interface SectionsExclusiveListing extends Schema.Component {
  collectionName: 'components_sections_exclusive_listings';
  info: {
    displayName: 'exclusiveListing';
    icon: 'cube';
    description: '';
  };
  attributes: {
    heading: Attribute.Component<'shared.header'>;
    buttonFromLink: Attribute.Component<'shared.link'>;
    title: Attribute.String;
    listings: Attribute.Relation<
      'sections.exclusive-listing',
      'oneToMany',
      'api::listing.listing'
    >;
  };
}

export interface SectionsFaq extends Schema.Component {
  collectionName: 'components_sections_faqs';
  info: {
    displayName: 'faq';
    icon: 'cube';
    description: '';
  };
  attributes: {
    heading: Attribute.Component<'shared.header'>;
    faqItems: Attribute.Component<'blocks.faq-item', true>;
    title: Attribute.String;
  };
}

export interface SectionsFooter extends Schema.Component {
  collectionName: 'components_sections_footers';
  info: {
    displayName: 'footer';
    icon: 'cube';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    footerIcon: Attribute.Media;
    callNowIcon: Attribute.Media;
    phone: Attribute.Relation<
      'sections.footer',
      'oneToOne',
      'api::nav-link.nav-link'
    >;
    socials: Attribute.Relation<
      'sections.footer',
      'oneToMany',
      'api::nav-link.nav-link'
    >;
    footerNav: Attribute.Component<'blocks.footer-nav', true>;
    copyright: Attribute.Component<'global.copyright'>;
  };
}

export interface SectionsHero extends Schema.Component {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'hero';
    icon: 'cube';
    description: '';
  };
  attributes: {
    card: Attribute.Component<'shared.card', true>;
    cardHead: Attribute.Component<'shared.card'>;
    ctaBtnLink: Attribute.Component<'shared.link'>;
    title: Attribute.String;
    heroVideo: Attribute.Media;
    heroVideoPlayIcon: Attribute.Media;
    heroVideoPauseIcon: Attribute.Media;
  };
}

export interface SectionsListingProps extends Schema.Component {
  collectionName: 'components_sections_listing_props';
  info: {
    displayName: 'listingProps';
    description: '';
  };
  attributes: {
    propAmount: Attribute.Decimal;
    propText: Attribute.String;
    propIcon: Attribute.Media;
  };
}

export interface SectionsListingTags extends Schema.Component {
  collectionName: 'components_sections_listing_tags';
  info: {
    displayName: 'listingTags';
    description: '';
  };
  attributes: {
    propertyType: Attribute.String;
    listingPrice: Attribute.String;
    listingStatus: Attribute.String;
  };
}

export interface SectionsProcessDetails extends Schema.Component {
  collectionName: 'components_sections_process_details';
  info: {
    displayName: 'processDetails';
    icon: 'cube';
    description: '';
  };
  attributes: {
    processStep: Attribute.Component<'shared.text', true>;
    heading: Attribute.String;
    processButton: Attribute.Component<'shared.link'>;
    title: Attribute.String;
  };
}

export interface SectionsRecentListings extends Schema.Component {
  collectionName: 'components_sections_recent_listings';
  info: {
    displayName: 'recentListings';
    icon: 'cube';
    description: '';
  };
  attributes: {
    listings: Attribute.Relation<
      'sections.recent-listings',
      'oneToMany',
      'api::listing.listing'
    >;
    title: Attribute.String & Attribute.DefaultTo<'recent-listings'>;
  };
}

export interface SectionsRelatedArticles extends Schema.Component {
  collectionName: 'components_sections_related_articles';
  info: {
    displayName: 'relatedArticles';
    icon: 'cube';
    description: '';
  };
  attributes: {
    articles: Attribute.Relation<
      'sections.related-articles',
      'oneToMany',
      'api::article.article'
    >;
    buttonFromLink: Attribute.Component<'shared.link'>;
    title: Attribute.String;
    heading: Attribute.Component<'shared.header'>;
  };
}

export interface SharedButton extends Schema.Component {
  collectionName: 'components_shared_buttons';
  info: {
    displayName: 'button';
    icon: 'cube';
    description: '';
  };
  attributes: {
    theme: Attribute.Enumeration<['primary', 'secondary', 'outline']>;
    link: Attribute.Component<'shared.link', true>;
    title: Attribute.String;
  };
}

export interface SharedCard extends Schema.Component {
  collectionName: 'components_blocks_cards';
  info: {
    displayName: 'card';
    icon: 'cube';
    description: '';
  };
  attributes: {
    theme: Attribute.Enumeration<['primary', 'secondary']>;
    heading: Attribute.String & Attribute.Required;
    subHeading: Attribute.String;
    link: Attribute.String;
    isExternal: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface SharedCurrency extends Schema.Component {
  collectionName: 'components_shared_currencies';
  info: {
    displayName: 'currencySwitch';
    icon: 'briefcase';
    description: '';
  };
  attributes: {
    homeCurrency: Attribute.String;
    foreignCurrency: Attribute.String;
    currencySwitchText: Attribute.String;
  };
}

export interface SharedHeader extends Schema.Component {
  collectionName: 'components_shared_headers';
  info: {
    displayName: 'header';
    icon: 'cube';
    description: '';
  };
  attributes: {
    theme: Attribute.Enumeration<['primary', 'secondary']>;
    heading: Attribute.String;
    subHeading: Attribute.String;
    title: Attribute.String;
  };
}

export interface SharedItemsPerPage extends Schema.Component {
  collectionName: 'components_shared_items_per_pages';
  info: {
    displayName: 'itemsPerPage';
    icon: 'cube';
  };
  attributes: {
    itemsPerPage: Attribute.Integer;
  };
}

export interface SharedLink extends Schema.Component {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'link';
    icon: 'link';
    description: '';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    href: Attribute.String;
    target: Attribute.Enumeration<['_blank']>;
    isExternal: Attribute.Boolean & Attribute.DefaultTo<false>;
    title: Attribute.String;
  };
}

export interface SharedListingTag extends Schema.Component {
  collectionName: 'components_blocks_listing_tags';
  info: {
    displayName: 'tag';
    icon: 'cube';
    description: '';
  };
  attributes: {
    tagTitle: Attribute.String & Attribute.Required;
  };
}

export interface SharedMoreFilterOptions extends Schema.Component {
  collectionName: 'components_shared_more_filter_options';
  info: {
    displayName: 'moreFilterOptions';
    icon: 'cube';
  };
  attributes: {
    title: Attribute.String;
    icon: Attribute.Media;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
    description: 'SEO metadata \u2014 meta title, description, and OG image.';
  };
  attributes: {
    metaTitle: Attribute.String;
    metaDescription: Attribute.Text;
    ogImage: Attribute.Media;
  };
}

export interface SharedText extends Schema.Component {
  collectionName: 'components_shared_texts';
  info: {
    displayName: 'text';
    description: '';
  };
  attributes: {
    text: Attribute.String;
    number: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'blocks.amenity': BlocksAmenity;
      'blocks.article-head-img': BlocksArticleHeadImg;
      'blocks.article-preview': BlocksArticlePreview;
      'blocks.blog-filter': BlocksBlogFilter;
      'blocks.contact-card': BlocksContactCard;
      'blocks.contact-form-label': BlocksContactFormLabel;
      'blocks.contact-form': BlocksContactForm;
      'blocks.faq-item': BlocksFaqItem;
      'blocks.footer-nav': BlocksFooterNav;
      'blocks.listing-contact': BlocksListingContact;
      'blocks.listing-details-body': BlocksListingDetailsBody;
      'blocks.listing-details': BlocksListingDetails;
      'blocks.listing-filter': BlocksListingFilter;
      'blocks.listing-form-field': BlocksListingFormField;
      'blocks.listing-info': BlocksListingInfo;
      'blocks.listing-props': BlocksListingProps;
      'blocks.option': BlocksOption;
      'blocks.search': BlocksSearch;
      'blocks.select': BlocksSelect;
      'blocks.tour-options': BlocksTourOptions;
      'global.banner': GlobalBanner;
      'global.copyright': GlobalCopyright;
      'global.navigation': GlobalNavigation;
      'sections.additional-details': SectionsAdditionalDetails;
      'sections.contact': SectionsContact;
      'sections.exclusive-listing': SectionsExclusiveListing;
      'sections.faq': SectionsFaq;
      'sections.footer': SectionsFooter;
      'sections.hero': SectionsHero;
      'sections.listing-props': SectionsListingProps;
      'sections.listing-tags': SectionsListingTags;
      'sections.process-details': SectionsProcessDetails;
      'sections.recent-listings': SectionsRecentListings;
      'sections.related-articles': SectionsRelatedArticles;
      'shared.button': SharedButton;
      'shared.card': SharedCard;
      'shared.currency': SharedCurrency;
      'shared.header': SharedHeader;
      'shared.items-per-page': SharedItemsPerPage;
      'shared.link': SharedLink;
      'shared.listing-tag': SharedListingTag;
      'shared.more-filter-options': SharedMoreFilterOptions;
      'shared.seo': SharedSeo;
      'shared.text': SharedText;
    }
  }
}
