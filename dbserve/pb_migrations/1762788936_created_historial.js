/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "bool2063623452",
        "name": "status",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "convertURLs": false,
        "hidden": false,
        "id": "editor26759595",
        "maxSize": 0,
        "name": "descripcion_problema",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "editor"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1531729310",
        "hidden": false,
        "id": "relation2427026673",
        "maxSelect": 999,
        "minSelect": 0,
        "name": "tecnicos_asociados",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_1119805642",
    "indexes": [],
    "listRule": null,
    "name": "historial",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1119805642");

  return app.delete(collection);
})
