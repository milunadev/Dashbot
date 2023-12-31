import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../Context';

function getLast7Dates() {
  const today = new Date();
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    dates.push(formattedDate);
}
  return dates
}

function compararConsultas(ultimasFechas, datosBaseDeDatos) {
  const resultados = {};

  for (const fecha of ultimasFechas) {
    resultados[fecha] = 0;
  }

  for (const consulta of datosBaseDeDatos) {
    const fechaConsulta = new Date(consulta.fecha).toISOString().split('T')[0];
    if (ultimasFechas.includes(fechaConsulta)) {
      resultados[fechaConsulta]++;
    }
  }

  return resultados;
}

async function consultar() {
  try {
    const response = await axios.get('http://localhost:3001/consultas');
    const respuesta_DB = response.data;
    console.log('respuestaDB: ', respuesta_DB);
    return respuesta_DB;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return []; // Retorna un array vacío en caso de error.
  }
}

async function utilizacion_7days() {
  const ultimasFechas = getLast7Dates();
  const datosBaseDeDatos = await consultar();
  console.log("uti: ", ultimasFechas)
  const fechasFormateadas = ultimasFechas.map((fecha) => fecha.split('T')[0]);

  const utilizacion_bot = compararConsultas(fechasFormateadas, datosBaseDeDatos);
  console.log('FINAL: ', utilizacion_bot);
  return utilizacion_bot;
}


export {utilizacion_7days}