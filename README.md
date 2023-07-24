# BluPro API

A fan-made API for the upcoming Blue Protocol release, providing access to game-related data and resources.

## Prerequisites

- [Node.js](https://nodejs.org/): ^12.0.0
- [NPM](https://npmjs.org/), [PNPM](https://pnpm.io/), or any other Node.js package manager

## Installation

Install the required packages using your preferred package manager, such as npm:

If you prefer to run the API on a different port, rename the `.env.example` file to `.env` and modify the `PORT` field to your preferred port.

Depending on whether you are installing the API for production or development, follow the corresponding steps below.

### Production

To build the project, use the following command:

```
npm run build
```

Then start the server with this command:

```
npm run start
```

### Development

To watch the project's files for changes, use the following command:

Then start the development server with this command:

## Contributing

Contributing is simple if you want to add new characters, nations, entity types, translations, etc. Follow the instructions below:

1. **Adding a new entity to an existing type:**

   - Create a new folder in the `assets/data/{entityType}` directory, replacing `{entityType}` with the lowercase name of the entity. Use hyphens instead of spaces. For example, `Blade Warden` becomes `blade-warden`.
   - Inside the new folder, create an `en.json` file containing the basic data of the entity you're adding. It's recommended to use the same field names as other entities with the same entity type.

2. **Adding a new entity type:**

   - Create a new folder in the `assets/data` directory, using the lowercase name of the entity type. Replace spaces with hyphens. For example, `Cooking Ingredients` becomes `cooking-ingredients`.
   - Add new entities to the new entity type following the instructions in **Adding a new entity to an existing type**.

3. **Adding entity translations:**

   - To add translations for an existing entity, create a new file named `{countryCode}.json` in the entity's folder. Replace `{countryCode}` with the appropriate country code, such as `fr` for French.
   - Provide translations for the existing data in the `en.json` file, overriding the content with the translated content. Whenever possible, use official translations over your own.

4. **Adding images to an entity:**

   - For entities like characters, serve images from `assets/images/{entityType}/{entityId}`. Images can be in various formats (`heic, heif, jpeg, jpg, png, raw, tiff, webp, gif`), but remove the file extension. For example, `icon.webp` becomes `icon`.
   - Place the image file in the corresponding `assets/images/{entityType}/{entityId}` folder or create the folder if it doesn't exist.

To contribute, create a new Pull Request [here](https://github.com/Arkezz/BluPro-API/pulls) with your changes. We will review it as soon as possible.

## API Documentation

For detailed information about the available endpoints and how to interact with the API, please refer to the [API documentation](link-to-documentation).(WIP)

## Disclaimer

While not a direct fork this project is _heavily_ inspired by the [genshindev/api](https://github.com/genshindev/api) project. Although it might differ more as the development furthers.

## License

This project is licensed under the OSL-3.0 License - see the [LICENSE](LICENSE) file for details.
