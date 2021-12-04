import { gql, useQuery } from '@apollo/client';
import { CourseSubMenu, KnownCourseMainMenu } from 'apps/web/components/Menu';
import client from '../../../../apollo-client';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import styled from 'styled-components';
import ClientOnly from '../../../../components/ClientOnly';
import ProgramNameLink from '../../../../components/ProgramAnchor';
import { ScoreTable, ScoreTablePLO } from '../../../../components/dashboards/table';
import { CourseStaticPaths } from 'apps/web/utils/staticpaths';

// path => /course/[id]/dashboards
export default ({course}: {course: CourseModel}) => {
  return (<div>
    <Head>
      <title>Dashboard</title>
    </Head>
    <ClientOnly> 
      <IndexPage course={course}/>
    </ClientOnly>
  </div>);
};

function IndexPage({course}: {course: CourseModel}) {
  const router = useRouter();
  const courseID = router.query.id as string;
  const [state, setState] = useState("Quiz");
  return <div>
    <KnownCourseMainMenu programID={course.programID} courseID={course.id} courseName={course.name}/>
    {/* <NavHistory courseID = {courseID}/> */}
    <CourseSubMenu courseID={course.id} selected={'dashboards'}/>
    <ButtonTab>
      <button onClick={() => setState("Quiz")} style={{marginRight: 5}}
      className="border border-blue-500 rounded-md border-2">
        {state === "Quiz" && <b>Quiz Score</b> || <span>Quiz Score</span>}
      </button>
      <button onClick={() => setState("Outcome")}
      className="border border-blue-500 rounded-md border-2">
        {state === "Outcome" && <b>Outcome Score</b> || <span>Outcome Score</span>}
      </button>
    </ButtonTab>
    {state === "Quiz" && <ScoreTable/>}
    {state === "Outcome" && <ScoreTablePLO/>}
  </div>;
};

// supply
interface CourseModel {
  id: string;
  name: string;
  programID: string;
}

function NavHistory({courseID}: {courseID: string}) {
  const {data, loading} = useQuery<{course: CourseModel}, {courseID: string}>(gql`
    query Course($courseID: ID!) {
      course(courseID: $courseID) {
        id
        name
        programID
    }}
  `, {variables: {courseID}});
  if (loading) return <p></p>;
  return (<p>
    <Link href="/">Home</Link>
    {' '}&#12297;{' '}
    <Link href="/programs">Programs</Link>
    {' '}&#12297;{' '}
    <ProgramNameLink programID={data.course.programID} href={`/program/${data.course.programID}/courses`}/>
    {' '}&#12297;{' '}
    <Link href={`/course/${data.course.id}`}>{data.course.name}</Link>
    
  </p>);
}

const ButtonTab = styled.div`
  display: inline-block;
`;

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps: GetStaticProps<{course: CourseModel}> = async (context) => {
  const { id: courseID } = context.params as Params;
  const GET_COURSE = gql`
    query CourseDescription($courseID: ID!) {
      course(courseID: $courseID) {
        id
        name
        programID
  }}`;
  const {data: {course}} = await client.query<{course: CourseModel}, {courseID: string}>({
    query: GET_COURSE,
    variables: {
      courseID
    }
  });
  return {
    props: {
      course,
    },
    revalidate: 60,
  };
}

export const getStaticPaths: GetStaticPaths = CourseStaticPaths;