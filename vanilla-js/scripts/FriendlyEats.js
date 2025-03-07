/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 * Initializes the FriendlyEats app.
 */
function FriendlyEats() {
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);
  if(isLocalhost) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  this.filters = {
    city: '',
    price: '',
    category: '',
    sort: 'Maior Nota'
  };

  this.dialogs = {};

  var that = this;
  // that.initAppCheck();

  firebase.auth().signInAnonymously().then(function() {
    that.initTemplates();
    that.initRouter();
    that.initReviewDialog();
    that.initFilterDialog();
  }).catch(function(err) {
    console.log(err);
  });
}

/**
 * Initializes the router for the FriendlyEats app.
 */
FriendlyEats.prototype.initRouter = function() {
  this.router = new Navigo();

  var that = this;
  this.router
    .on({
      '/': function() {
        that.updateQuery(that.filters);
      }
    })
    .on({
      '/setup': function() {
        that.viewSetup();
      }
    })
    .on({
      '/restaurants/*': function() {
        var path = that.getCleanPath(document.location.pathname);
        var id = path.split('/')[2];
        that.viewRestaurant(id);
      }
    })
    .resolve();

  firebase
    .firestore()
    .collection('restaurants')
    .limit(1)
    .onSnapshot(function(snapshot) {
      if (snapshot.empty) {
        that.router.navigate('/setup');
      }
    });
};

FriendlyEats.prototype.getCleanPath = function(dirtyPath) {
  if (dirtyPath.startsWith('/index.html')) {
    return dirtyPath.split('/').slice(1).join('/');
  } else {
    return dirtyPath;
  }
};

FriendlyEats.prototype.getFirebaseConfig = function() {
  return firebase.app().options;
};

FriendlyEats.prototype.getRandomItem = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

FriendlyEats.prototype.data = {
  words: [
    'Bar',
    'Fogo',
    'Grill',
    'Drive Thru',
    'Place',
    'Melhor',
    'Local',
    'Prime',
    'Eatin\''
  ],
  cities: [
    'Limeira',
    'Campinas',
    'Americana',
    'Rio Claro',
    'Indaiatuba',
    'Piracicaba'
  ],
  categories: [
    'Hamburguer',
    'Japa',
    'Cafe',
    'Italiana',
    'Pizza',
    'Indiana',
    'Mexicana',
    'Grill'
  ],
  ratings: [
    {
      rating: 1,
      text: 'Nunca comerei aqui de novo'
    },
    {
      rating: 2,
      text: 'Não vale a visita'
    },
    {
      rating: 3,
      text: 'Simplesmente ok...'
    },
    {
      rating: 4,
      text: 'Muito bom, eu recomendaria!'
    },
    {
      rating: 5,
      text: 'Esse é meu lugar favorito para comer!!'
    }
  ]
};
window.onload = function() {
  window.app = new FriendlyEats();
};

module.exports = FriendlyEats;