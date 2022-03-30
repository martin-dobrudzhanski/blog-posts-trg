export const state = () => {
  return {
    title: 'Blog Title',
    description:
      'Lorem ipsum Lorem ipsum Lorem ipsumLorem ipsum ipsumLoremipsumLorem ',
    categories: [
      {
        id: 1,
        name: 'Mains',
        items: [
          {
            title: 'Mains Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          },
          {
            title: 'Mains Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          },
          {
            title: 'Mains Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          },
          {
            title: 'Mains Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          },
          {
            title: 'Mains Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          }
        ]
      },
      {
        id: 2,
        name: 'Desserts',
        items: [
          {
            title: 'Desserts Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          },
          {
            title: 'Desserts Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          }
        ]
      },
      {
        id: 3,
        name: 'Salads',
        items: [
          {
            title: 'Salads Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          },
          {
            title: 'Salads Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          },
          {
            title: 'Salads Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          },
          {
            title: 'Salads Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          }
        ]
      },
      {
        id: 4,
        name: 'Sides',
        items: [
          {
            title: 'Sides Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          },
          {
            title: 'Sides Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum'
          }
        ]
      }
    ]
  };
};

export const getters = {
  getTitle(state) {
    return state.title;
  },
  getDescription(state) {
    return state.description;
  },
  getCategories(state) {
    return state.categories;
  }
};

export const actions = {};

export const mutations = {};
