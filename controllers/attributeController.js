import db from "../models/index.js";
import { validate as isUuid } from "uuid";

const { Attribute, AttributeValue } = db;

export const getAllAttributes = async (req, res) => {
  const orderBy = req.query.orderby || "updatedAt";
  const order = req.query.order || "DESC";

  const attributes = await Attribute.findAll({
    limit: 10,
    order: [[orderBy, order]],
    include: [
      {
        model: AttributeValue,
        as: "values",
      },
    ],
  });

  res.send(attributes);
};

export const getAttribute = async (req, res) => {
  const uuid = req.params.uuid;

  if (!isUuid(uuid)) {
    return res.status(400).send({
      error: "Invalid UUID format",
    });
  }

  const attribute = await Attribute.findOne({
    where: { uuid },
    include: [
      {
        model: AttributeValue,
        as: "values",
      },
    ],
  });

  if (!attribute) {
    return res.status(404).send({ error: "Attribute not found!" });
  }

  res.send(attribute);
};

export const createAttribute = async (req, res) => {
  const { name: attributeName, values: attributeValues } = req.body;

  if (!attributeName) {
    return res.status(400).send({ error: "Attribute Name is required!" });
  }

  const isNameValid = attributeName.length > 3;

  if (!isNameValid) {
    return res
      .status(400)
      .send({ error: "Attribute Name should be at least 3 characters long!" });
  }

  // ADD transaction
  const newAttribute = await Attribute.create({ name: attributeName });

  attributeValues.forEach(async (attributeValue) => {
    await AttributeValue.create({
      attribute_id: newAttribute.dataValues.id,
      value: attributeValue,
    });
  });

  res.send(newAttribute);
};

export const updateAttribute = async (req, res) => {
  const uuid = req.params.uuid;

  if (!isUuid(uuid)) {
    return res.status(400).send({
      error: "Invalid UUID format",
    });
  }

  // check if name exists in request body
  const { name: attributeName, values: attributeValues } = req.body;

  if (!attributeName) {
    return res.status(400).send({ error: "Attribute Name is required!" });
  }

  // validate name
  const isNameValid = attributeName.length > 3;

  if (!isNameValid) {
    return res
      .status(400)
      .send({ error: "Attribute Name should be at least 3 characters long!" });
  }

  // ADD transaction
  // update attribute name
  const [updated] = await Attribute.update(
    { name: attributeName },
    { where: { uuid } }
  );

  if (!updated) {
    return res.status(404).send({ error: "Attribute is not updated!" });
  }

  const attribute = await Attribute.findOne({ where: { uuid } });

  const allAttributeValues = await AttributeValue.findAll({
    where: { attribute_id: attribute.id },
    raw: true,
  });

  // берем все аттрибуты allAttributeValues и берем аттрибуты которые приходят attributeValues и сравниваем 2 array
  // аттрибуты которые есть в attributeValues и которых нет в allAttributeValues добавляем в toCreate
  // аттрибуты которых нет в attributeValues и которые есть в allAttributeValues добавляем в toDelete
  // аттрибуты которые есть в attributeValues и которые есть в allAttributeValues добавляем в toUpdate

  console.log(41, attributeValues);
  console.log(
    42,
    allAttributeValues.map(({ uuid, value }) => ({ uuid, value }))
  );

  attributeValues.map(({ uuid, value }) => ({ uuid, value }));

  const toCreate = attributeValues.filter(
    (obj1) => !allAttributeValues.some((obj2) => obj1.uuid === obj2.uuid)
  );

  const toDelete = allAttributeValues.filter(
    (obj1) => !attributeValues.some((obj2) => obj1.uuid === obj2.uuid)
  );

  const toUpdate = allAttributeValues
    .map((obj1) => {
      const matchedObj = attributeValues.find(
        (obj2) => obj1.uuid === obj2.uuid
      );
      return matchedObj ? { ...obj1, ...matchedObj } : obj1;
    })
    .filter((obj) => attributeValues.some((obj2) => obj.uuid === obj2.uuid));

  console.log("toCreate:", toCreate);
  console.log("toDelete:", toDelete);
  console.log("toUpdate:", toUpdate);

  // update
  toUpdate.forEach(async (attributeValue) => {
    await AttributeValue.update(
      { value: attributeValue.value },
      { where: { uuid: attributeValue.uuid } }
    );
  });

  // create
  toCreate.forEach(async (attributeValue) => {
    await AttributeValue.create({
      attribute_id: attribute.id,
      value: attributeValue.value,
    });
  });

  // delete
  toDelete.forEach(async (attributeValue) => {
    await AttributeValue.destroy({
      where: { uuid: attributeValue.uuid },
    });
  });

  const updatedAttribute = await Attribute.findOne({ where: { uuid } });
  return res.send(updatedAttribute);
};

export const deleteAttribute = async (req, res) => {
  const uuid = req.params.uuid;

  if (!isUuid(uuid)) {
    return res.status(400).send({
      error: "Invalid UUID format",
    });
  }

  const deleted = await Attribute.destroy({
    where: { uuid },
  });

  if (!deleted) {
    return res.status(404).send({ error: "Attribute not found!" });
  }

  return res.send({ message: "Attribute deleted successfully" });
};
