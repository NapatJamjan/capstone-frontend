import Head from 'next/head';
import Link from 'next/link';
import client from '../../../apollo-client';
import { gql, useMutation, useQuery } from '@apollo/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import ClientOnly from '../../../components/ClientOnly';
import ProgramAnchor from '../../../components/ProgramAnchor';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import xlsx from 'xlsx';
import { ProgramStaticPaths } from '../../../utils/staticpaths';

interface ProgramModel {
  id: string;
  name: string;
  description: string;
};

interface CreatePLOGroupResponse {
  id: string;
  name: string;
};

interface PLOGroupModel {
  id: string;
  name: string;
};

interface CreatePLOModel {
  title: string;
  description: string;
};

interface CreatePLOModel {
  title: string;
  description: string;
};

interface PLOModel {
  id: string;
  title: string;
  description: string;
  ploGroupID: string;
};


export default function PLOs({programID}: {programID: string}) {
  const GET_PLOGROUPS = gql`
    query PLOGroups($programID: ID!) {
      ploGroups(programID: $programID) {
        id
        name
      }
    }
  `;
  const { data, loading, refetch } = useQuery<{ploGroups: PLOGroupModel[]}, {programID: string}>(GET_PLOGROUPS, {variables: {programID}});
  const [selectedPLOGroupID, setSelectedPLOGroupID] = useState<string>('');
  return (<div>
    <Head>
      <title>Manage PLOs</title>
    </Head>
    <p>
      <Link href="/">Home</Link>
      &nbsp;&#12297;&nbsp;
      <Link href="/programs">Programs</Link>
      &nbsp;&#12297;&nbsp;
      <ClientOnly>
        <ProgramAnchor programID={programID} href=""/>
      </ClientOnly>
    </p>
    <p className="my-3">
      <Link href={`/program/${programID}/courses`}>Courses</Link>
      <span className="mx-3"></span>
      <span className="underline">PLOs</span>
    </p>
    <CreatePLOGroupForm programID={programID} callback={() => { refetch(); setSelectedPLOGroupID(''); }}/>
    <div className="grid grid-cols-2 gap-x gap-x-6 mt-2">
      <div className="flex flex-column space-y-2">
        {loading && <p>Loading...</p>}
        {data && [...data.ploGroups].sort((p1, p2) => p1.name.localeCompare(p2.name)).map((ploGroup) => (
          <div key={ploGroup.id} className="rounded shadow-lg p-3">
            <div className="flex justify-between items-center">
              <span className="font-bold">{ploGroup.name}</span>
            </div>
            <span className="underline cursor-pointer text-blue-300" onClick={() => setSelectedPLOGroupID(ploGroup.id)}>Manage</span>
          </div>
        ))}
      </div>
      <div>
        {selectedPLOGroupID !== '' && <PLOSub ploGroupID={selectedPLOGroupID}/>}
      </div>
    </div>
  </div>);
};

const CreatePLOGroupForm: React.FC<{ programID: string, callback: () => any }> = ({programID, callback}) => {
  const CREATE_PLOGROUP = gql`
    mutation CreatePLOGroup($programID: ID!, $name: String!, $input: [CreatePLOsInput!]!) {
      createPLOGroup(programID: $programID, name: $name, input: $input) {
        id
        name
      }
    }
  `;
  const [createPLOGroup, { loading }] = useMutation<{createPLOGroup: CreatePLOGroupResponse}, {programID: string, name: string, input: CreatePLOModel[]}>(CREATE_PLOGROUP);
  const [excelFile, setExcelFile] = useState<CreatePLOModel[]>([]);
  const excelJSON = (file) => {
    let reader = new FileReader();
    reader.onload = function(e) {
      let data = e.target.result;
      let workbook = xlsx.read(data, {type: 'binary'});
      setExcelFile(xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
    }
    reader.onerror = console.log;
    reader.readAsBinaryString(file);
  };
  const [show, setShow] = useState<boolean>(false);
  const { register, handleSubmit, setValue } = useForm<{name: string}>();
  const resetForm = () => {
    setShow(false);
    setValue('name', '');
    setExcelFile([]);
  };
  const submitForm = (name: string) => {
    if (name !== '' && excelFile.length !== 0) {
      createPLOGroup({
        variables: {
          programID,
          name,
          input: excelFile
        }
      }).then(() => {
        resetForm();
        callback();
      });
    }
  }
  return (
    <div>
      <button onClick={() => setShow(true)}>Create a new PLO Group.</button>
      <Modal show={show} onHide={() => setShow(false)}>
        <form onSubmit={handleSubmit((form) => loading? null: submitForm(form.name))}>
          <Modal.Header>
            <Modal.Title>Create a new PLO group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span>PLO group name:</span><br/>
            <input type="text" {...register('name')} placeholder="PLO group name" className="border-4 rounded-md p-1 mx-2 text-sm"/><br/>
            <span>Upload PLOs:</span><br/>
            <input type="file" onChange={e => excelJSON(e.target.files[0])} className="p-1 mx-2 text-sm"/><br/>
          </Modal.Body>
          <Modal.Footer>
            <input type="submit" value="create" className="py-2 px-4 bg-green-300 hover:bg-green-500 rounded-lg"/>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

const PLOSub: React.FC<{ ploGroupID: string }> = ({ ploGroupID }) => {
  if (ploGroupID === '') {
    return <p></p>;
  }
  const GET_PLOS = gql`
    query PLOs($ploGroupID: ID!) {
      plos(ploGroupID: $ploGroupID) {
        id
        title
        description
        ploGroupID
      }
    }
  `;
  const { data, loading, refetch } = useQuery<{plos: PLOModel[]}, {ploGroupID: string}>(GET_PLOS, { variables: { ploGroupID } });
  if (loading) {
    return <p>Loading...</p>
  }
  return (
    <div>
      <CreatePLOForm ploGroupID={ploGroupID} callback={refetch}/>
      {[...data.plos].sort((p1, p2) => p1.title.localeCompare(p2.title)).map((plo) => (
        <div key={plo.id} className="flex flex-column rounded shadow-lg p-3 mb-3 -space-y-4">
          <p className="text-xl text-bold">{plo.title}</p>
          <span className="m-0">{plo.description}</span>
        </div>
      ))}
    </div>
  );
};

const CreatePLOForm: React.FC<{ ploGroupID: string, callback: () => any }> = ({ ploGroupID, callback }) => {
  const CREATE_PLO = gql`
    mutation CreatePLO($ploGroupID: ID!, $input: CreatePLOInput!) {
      createPLO(ploGroupID: $ploGroupID, input: $input) {
        id
        title
        description
        ploGroupID
      }
    }
  `;
  const [createPLO, { loading }] = useMutation<{createPLO: PLOModel}, {ploGroupID: string, input: CreatePLOModel}>(CREATE_PLO);
  const [show, setShow] = useState<boolean>(false);
  const { register, handleSubmit, reset, formState: {errors, touchedFields} } = useForm<CreatePLOModel>();
  const resetForm = () => {
    reset({title: '', description: ''});
    setShow(false);
  };
  const submitForm = (form: CreatePLOModel) => {
    createPLO({
      variables: {
        ploGroupID,
        input: form
      }
    }).then(() => {
      resetForm();
      callback();
    });
  };
  return (
    <div>
      <button onClick={() => setShow(true)} className="bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-sm">
        Create a new PLO <span className="text-xl text-green-800">+</span>
      </button>
      <Modal show={show} onHide={() => resetForm()}>
        <form onSubmit={handleSubmit((form) => loading? null: submitForm(form))}>
          <Modal.Header>
            <Modal.Title>Create a new PLO</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="text" {...register('title', {required: true})} placeholder="type PLO's name" className="border-4 rounded-md p-1 mx-2 text-sm"/>
            <br/><span className="text-red-500 text-sm italic pl-3">{touchedFields.title && errors.title && 'PLO name is required.'}</span>
            <p className="my-3"></p>
            <textarea {...register('description')} placeholder="PLO's description" cols={40} rows={4} className="border-4 rounded-md p-1 mx-2 text-sm"></textarea>
          </Modal.Body>
          <Modal.Footer>
            <input type="submit" value="create" className="py-2 px-4 bg-green-300 hover:bg-green-500 rounded-lg"/>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps: GetStaticProps<{programID: string}> = async (context) => {
  const { id: programID } = context.params as Params;
  return {
    props: {
      programID
    },
    revalidate: false,
  };
};

export const getStaticPaths: GetStaticPaths = ProgramStaticPaths;