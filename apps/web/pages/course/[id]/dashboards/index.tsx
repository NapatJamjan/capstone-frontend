import { gql, useQuery } from '@apollo/client';
import { CourseSubMenu } from 'apps/web/components/Menu';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';
import ClientOnly from '../../../../components/ClientOnly';
import ProgramAnchor from '../../../../components/ProgramAnchor';
import { ScoreTable, ScoreTablePLO } from './table';

// path => /course/[id]/dashboards
export default function Index() {
  return (<div>
    <Head>
      <title>Dashboard</title>
    </Head>
    <ClientOnly> 
      <IndexPage/>
    </ClientOnly>
  </div>);
};

function IndexPage() {
  const router = useRouter();
  const courseID = router.query.id as string;
  const [state, setState] = useState("Quiz");
  return <div>
    <NavHistory courseID={courseID}/>
    {/*<Link href={`/course/${courseID}`}>Back to Course Homepage</Link><br/>
    <button onClick={() => router.push(`/course/${courseID}`)}>This also works</button><br/>*/}
    <CourseSubMenu courseID={courseID} selected={'dashboards'}/>
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
    <ProgramAnchor programID={data.course.programID} href={`/program/${data.course.programID}/courses`}/>
    {' '}&#12297;{' '}
    <Link href={`/course/${data.course.id}`}>{data.course.name}</Link>
    {' '}&#12297;{' '}
    <span>Dashboard</span>
  </p>);
}

const ButtonTab = styled.div`
  display: inline-block;
`;



function setState(arg0: string): void {
  throw new Error('Function not implemented.');
}
/**
 * quiz
 *  id
 *  name  
 *  questions
 *    id
 *    title
 *    maxScore
 *    questionLink
 *      loID
 *        links
 *          ploID
 *            title
 *        title
 *        description
 *      level
 *    result
 *      studentID
 *        name
 *      score
 */
