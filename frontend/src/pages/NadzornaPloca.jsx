import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Highcharts from 'highcharts';
import PieChart from 'highcharts-react-official';
import Service from '../services/GrupaService';
import useLoading from '../hooks/useLoading';

/**
 * Nadzorna ploča prikazuje grafički prikaz broja vježbača po grupama
 */
export default function NadzornaPloca() {
  const [podaci, setPodaci] = useState([]);
  const { showLoading, hideLoading } = useLoading();

  // Dohvaća podatke za graf
  async function getPodaci() {
    showLoading();
    try {
      const odgovor = await Service.grafGrupe();
      setPodaci(
        odgovor.map((grupa) => ({
          y: grupa.ukupnoVjezbaca,
          name: grupa.nazivGrupe,
        }))
      );
    } finally {
      hideLoading();
    }
  }

  useEffect(() => {
    getPodaci();
  }, []);

  return (
    <Container className="mt-4">
      {podaci.length > 0 && (
        <PieChart
          highcharts={Highcharts}
          options={{
            ...fixedOptions,
            series: [
              {
                name: 'Vježbači',
                colorByPoint: true,
                data: podaci,
              },
            ],
          }}
        />
      )}
    </Container>
  );
}

// Fiksne postavke za pie chart
const fixedOptions = {
  chart: {
    backgroundColor: '#121212',
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  title: {
    text: 'Broj vježbača po grupi',
    align: 'left',
    style: {
      color: '#e0e0e0',
    },
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    style: {
      color: '#121212',
    },
  },
  accessibility: {
    enabled: false,
    point: {
      valueSuffix: '%',
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>',
        style: {
          color: '#e0e0e0',
        },
      },
    },
  },
};
