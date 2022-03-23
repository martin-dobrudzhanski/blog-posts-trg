function createBookingCoreResponseBody(requestBody) {
  return {
    name: requestBody.name,
    email: requestBody.email,
    locationTitle: requestBody.locationTitle,
    locationStreet: requestBody.locationStreet,
    locationAdditional: requestBody.locationAdditional,
    locationName: requestBody.locationName,
    locationCity: requestBody.locationCity,
    locationPostalCode: requestBody.locationPostalCode,
    locationTelephone: requestBody.locationTelephone,
    locationUrl: process.env.LOCATION_URL,
    prettyDate: requestBody.prettyDate
  };
}

function createLiveresCoreOptions(liveresOptions, responseBody) {
  liveresOptions.Guest.FirstName = responseBody.name;
  liveresOptions.Guest.Email = responseBody.email;
  liveresOptions.locationTitle = responseBody.locationTitle;
  liveresOptions.locationStreet = responseBody.locationStreet;
  liveresOptions.locationAdditional = responseBody.locationAdditional;
  liveresOptions.locationName = responseBody.locationName;
  liveresOptions.locationCity = responseBody.locationCity;
  liveresOptions.locationPostalCode = responseBody.locationPostalCode;
  liveresOptions.locationTelephone = responseBody.locationTelephone;
  liveresOptions.locationUrl = responseBody.locationUrl;
  liveresOptions.prettyDate = responseBody.prettyDate;

  return liveresOptions;
}

export function createBookingConfirmationResponseBody(requestBody) {
  const responseBody = createBookingCoreResponseBody(requestBody);

  responseBody.session = requestBody.session;
  responseBody.siteRef = requestBody.siteRef;
  responseBody.siteSlug = requestBody.siteSlug;
  responseBody.dateTime = requestBody.dateTime;
  responseBody.numAdults = requestBody.numAdults;
  responseBody.numChildren = requestBody.numChildren;
  responseBody.specialRequest = requestBody.specialRequest;
  responseBody.CancelUrl = `${process.env.LOCATION_URL}/restaurants/${requestBody.siteSlug}/book/cancel/{reference}`;
  responseBody.AmendUrl = `${process.env.LOCATION_URL}/restaurants/${requestBody.siteSlug}/book/amend/{reference}`;
  responseBody.tel = requestBody.tel;
  responseBody.marketingOptOut = requestBody.marketingOptOut;
  responseBody.prettyTime = requestBody.prettyTime;

  return responseBody;
}

export function createBookingUpdateResponseBody(requestBody) {
  const responseBody = createBookingConfirmationResponseBody(requestBody);

  responseBody.bookingRef = requestBody.bookingRef;

  return responseBody;
}

export function createBookingCancellationResponseBody(requestBody) {
  const responseBody = createBookingCoreResponseBody(requestBody);

  responseBody.bookingRef = requestBody.bookingRef;

  return responseBody;
}

export function createLiveresBookingConfirmationOptions(
  liveresDefaultOptions,
  responseBody
) {
  const liveresOptions = createLiveresCoreOptions(
    liveresDefaultOptions,
    responseBody
  );

  liveresOptions.SessionName = responseBody.session;
  liveresOptions.RestaurantCode = responseBody.siteRef;
  liveresOptions.DateTime = responseBody.dateTime;
  liveresOptions.AdultCovers = responseBody.numAdults;
  liveresOptions.childCovers = responseBody.numChildren;
  liveresOptions.SpecialRequest = responseBody.specialRequest || '';
  liveresOptions.CancelUrl = `${process.env.LOCATION_URL}/restaurants/${responseBody.siteSlug}/book/cancel/{reference}`;
  liveresOptions.AmendUrl = `${process.env.LOCATION_URL}/restaurants/${responseBody.siteSlug}/book/amend/{reference}`;
  liveresOptions.Guest.FirstName = responseBody.name;
  liveresOptions.Guest.Email = responseBody.email;
  liveresOptions.Guest.PhoneNumber = responseBody.tel;
  liveresOptions.locationTitle = responseBody.locationTitle;
  liveresOptions.locationStreet = responseBody.locationStreet;
  liveresOptions.locationAdditional = responseBody.locationAdditional;
  liveresOptions.locationName = responseBody.locationName;
  liveresOptions.locationCity = responseBody.locationCity;
  liveresOptions.locationPostalCode = responseBody.locationPostalCode;
  liveresOptions.locationTelephone = responseBody.locationTelephone;
  liveresOptions.locationUrl = responseBody.locationUrl;
  liveresOptions.locationMapUrl = `http://maps.google.com/?q=${responseBody.locationPostalCode}`;
  liveresOptions.prettyDate = responseBody.prettyDate;
  liveresOptions.prettyTime = responseBody.prettyTime;
  liveresOptions.marketingOptOut =
    responseBody.marketingOptOut === 'true' ? {} : responseBody.marketingOptOut;

  return liveresOptions;
}

export function createLiveresBookingUpdateOptions(
  liveresDefaultOptions,
  responseBody
) {
  const liveresOptions = createLiveresBookingConfirmationOptions(
    liveresDefaultOptions,
    responseBody
  );

  liveresOptions.bookingRef = responseBody.bookingRef;

  return liveresOptions;
}

export function createBookingCancellationLiveresOptions(
  liveresDefaultOptions,
  responseBody
) {
  const liveresOptions = createLiveresCoreOptions(
    liveresDefaultOptions,
    responseBody
  );

  liveresOptions.bookingRef = responseBody.bookingRef;

  return liveresOptions;
}

function validateBookingCore(requestParam) {
  const validationErrors = [];

  if (!requestParam.name) {
    validationErrors.push({ name: requestParam.name });
  }
  if (!requestParam.email) {
    validationErrors.push({ email: requestParam.email });
  }
  if (!requestParam.locationTitle) {
    validationErrors.push({ locationTitle: requestParam.locationTitle });
  }
  if (!requestParam.locationStreet) {
    validationErrors.push({ locationStreet: requestParam.locationStreet });
  }
  if (!requestParam.locationName) {
    validationErrors.push({ locationName: requestParam.locationName });
  }
  if (!requestParam.locationCity) {
    validationErrors.push({ locationCity: requestParam.locationCity });
  }
  if (!requestParam.locationPostalCode) {
    validationErrors.push({
      locationPostalCode: requestParam.locationPostalCode
    });
  }
  if (!requestParam.locationTelephone) {
    validationErrors.push({
      locationTelephone: requestParam.locationTelephone
    });
  }
  if (!requestParam.prettyDate) {
    validationErrors.push({ prettyDate: requestParam.prettyDate });
  }

  return validationErrors;
}

export function validateBookingConfirmation(requestBody) {
  const validationErrors = validateBookingCore(requestBody);

  if (!requestBody.session) {
    validationErrors.push({ session: requestBody.session });
  }
  if (!requestBody.siteRef) {
    validationErrors.push({ siteRef: requestBody.siteRef });
  }
  if (!requestBody.siteSlug) {
    validationErrors.push({ siteSlug: requestBody.siteSlug });
  }
  if (!requestBody.dateTime) {
    validationErrors.push({ dateTime: requestBody.dateTime });
  }
  if (!requestBody.numAdults) {
    validationErrors.push({ numAdults: requestBody.numAdults });
  }
  if (!requestBody.tel) {
    validationErrors.push({ tel: requestBody.tel });
  }
  if (!requestBody.prettyTime) {
    validationErrors.push({ prettyTime: requestBody.prettyTime });
  }

  return validationErrors;
}

export function validateBookingUpdate(requestBody) {
  const validationErrors = validateBookingConfirmation(requestBody);

  if (!requestBody.bookingRef) {
    validationErrors.push({ bookingRef: requestBody.bookingRef });
  }

  return validationErrors;
}

export function createSpecialRequest(specialRequest) {
  let specialRequestValue = '';

  if (specialRequest && specialRequest !== '') {
    specialRequestValue = `"The following request(s) were noted : ${specialRequest}"`;
  }

  return specialRequestValue;
}

export function createBookingDate(bookingDate) {
  if (bookingDate !== 'Today' && bookingDate !== 'Tomorrow') {
    bookingDate = `on ${bookingDate}`;
  }

  return bookingDate;
}
