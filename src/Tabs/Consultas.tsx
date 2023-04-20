import { VStack, Divider, ScrollView } from 'native-base'
import { Botao } from '../componentes/Botao'
import { CardConsulta } from '../componentes/CardConsulta'
import { Titulo } from '../componentes/Titulo'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { pegarConsultasPaciente } from '../servicos/PacienteServico'

interface Especialista {
  especialidade: string;
  id: string;
  nome: string;
  imagem: string;
}

interface Consulta {
  data: string;
  especialista: Especialista;
  id: string;
}

export default function Consultas(){
  const [consultasProximas, setConsultasProximas] = useState<Consulta[]>([])
  const [consultasPassadas, setConsultasPassadas]= useState<Consulta[]>([])

  useEffect(() => {
    async function carregarConsultas(){
      const pacienteId = await AsyncStorage.getItem('pacienteId')
      if(!pacienteId) return null
      const consultas: Consulta[] = await pegarConsultasPaciente(pacienteId)

      const agora = new Date();
      const proximas = consultas.filter((consulta) => new Date(consulta.data) > agora)

      const passadas = consultas.filter((consulta) => new Date(consulta.data) <= agora)

      setConsultasProximas(proximas)
      setConsultasPassadas(passadas)
    }
    carregarConsultas()
  }, [])

  return(
    <ScrollView p="5">
      <Titulo color="blue.500">Minhas consultas</Titulo>
      <Botao mt={5} mb={5}>Agendar nova consulta</Botao>

      <Titulo color="blue.500" fontSize="lg" alignSelf="flex-start" mb={2}>Próximas consultas</Titulo>
      {consultasProximas?.map((consulta) => (
        <CardConsulta 
          nome={consulta?.especialista?.nome}
          especialidade={consulta?.especialista?.especialidade}
          foto={consulta?.especialista?.imagem}
          data={consulta?.data}
          foiAgendado
          key={consulta.id}
        />
      )) }

      <Divider mt={5} />

      <Titulo color="blue.500" fontSize="lg" alignSelf="flex-start" mb={2}>Consultas passadas</Titulo>
      {consultasPassadas?.map((consulta) => (
        <CardConsulta 
          nome={consulta?.especialista?.nome}
          especialidade={consulta?.especialista?.especialidade}
          foto={consulta?.especialista?.imagem}
          data={consulta?.data}
          foiAtendido
          key={consulta.id}
        />
      )) }
    </ScrollView>
  )
}