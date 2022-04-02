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
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              '//images.ctfassets.net/w3qjq8no4dj7/2NoUGOFqwiJw7hjiHM0yNl/5984e29f07101a79ae8a5f10af80fd3a/DSC05898_2x.jpg?fit=fill&w=840&h=840'
          },
          {
            title: 'Mains Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              '//images.ctfassets.net/w3qjq8no4dj7/2NoUGOFqwiJw7hjiHM0yNl/5984e29f07101a79ae8a5f10af80fd3a/DSC05898_2x.jpg?fit=fill&w=840&h=840'
          },
          {
            title: 'Mains Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              '//images.ctfassets.net/w3qjq8no4dj7/2NoUGOFqwiJw7hjiHM0yNl/5984e29f07101a79ae8a5f10af80fd3a/DSC05898_2x.jpg?fit=fill&w=840&h=840'
          },
          {
            title: 'Mains Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              '//images.ctfassets.net/w3qjq8no4dj7/2NoUGOFqwiJw7hjiHM0yNl/5984e29f07101a79ae8a5f10af80fd3a/DSC05898_2x.jpg?fit=fill&w=840&h=840'
          },
          {
            title: 'Mains Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              '//images.ctfassets.net/w3qjq8no4dj7/2NoUGOFqwiJw7hjiHM0yNl/5984e29f07101a79ae8a5f10af80fd3a/DSC05898_2x.jpg?fit=fill&w=840&h=840'
          },
          {
            title: 'Mains Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              '//images.ctfassets.net/w3qjq8no4dj7/2NoUGOFqwiJw7hjiHM0yNl/5984e29f07101a79ae8a5f10af80fd3a/DSC05898_2x.jpg?fit=fill&w=840&h=840'
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
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              'https://www.tasteofhome.com/wp-content/uploads/2019/05/Fried-Ice-Cream-Dessert-Bars-_EXPS_SDJJ19_232652_B02_06_1b_rms-2.jpg?fit=700,1024'
          },
          {
            title: 'Desserts Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              'https://www.tasteofhome.com/wp-content/uploads/2019/05/Fried-Ice-Cream-Dessert-Bars-_EXPS_SDJJ19_232652_B02_06_1b_rms-2.jpg?fit=700,1024'
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
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              'https://images.immediate.co.uk/production/volatile/sites/30/2017/06/healthy-nicoise-09b6cd9.jpg'
          },
          {
            title: 'Salads Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              'https://images.immediate.co.uk/production/volatile/sites/30/2017/06/healthy-nicoise-09b6cd9.jpg'
          },
          {
            title: 'Salads Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              'https://images.immediate.co.uk/production/volatile/sites/30/2017/06/healthy-nicoise-09b6cd9.jpg'
          },
          {
            title: 'Salads Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              'https://images.immediate.co.uk/production/volatile/sites/30/2017/06/healthy-nicoise-09b6cd9.jpg'
          },
          {
            title: 'Salads Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              'https://images.immediate.co.uk/production/volatile/sites/30/2017/06/healthy-nicoise-09b6cd9.jpg'
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
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              'https://thekitchencommunity.org/wp-content/uploads/2021/09/shutterstock_149755205-sides-for-fish.jpg'
          },
          {
            title: 'Sides Title',
            description:
              'Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum',
            thumbnail:
              'https://thekitchencommunity.org/wp-content/uploads/2021/09/shutterstock_149755205-sides-for-fish.jpg'
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
