export default {
  head() {
    return this.getMeta(this.metaTitle, this.metaDescription);
  },
  methods: {
    getMeta(title, description) {
      const meta = {};
      const defaultDescription = 'Chiquito - Mexican Restaurant';

      if (!title) {
        if (this.content && this.content.pageHeading) {
          meta.title = this.content.pageHeading;
        } else {
          meta.titleTemplate = defaultDescription;
        }
      } else {
        meta.title = title;
      }

      if (!description)
        description =
          this.$store.state.ui.metaDescription || defaultDescription;

      return {
        ...meta,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: description
          }
        ]
      };
    }
  },
  computed: {
    metaTitle() {
      const content = this.content;

      return content && (content.metaTitle || content.pageHeading);
    },
    metaDescription() {
      const content = this.content;

      return content && (content.metaDescription || content.pageDescription);
    }
  }
};
