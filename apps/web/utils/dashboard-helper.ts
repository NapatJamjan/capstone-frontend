import client from '../apollo-client';
import { gql, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';


// ================================================================================================
const GET_STUDENTS_IN_COURSE = gql`
  query StudentsInCourse($courseID: ID!) {
    studentsInCourse(courseID: $courseID) {
      id
      email
      name
      surname
    }
  }
`;
interface Student {
  id: string;
  email: string;
  name: string;
  surname: string;
};
interface CustomStudent {
  id: string;
  email: string;
  fullname: string;
};

export function useStudent(courseID: string): [CustomStudent[], boolean] {
  const [students, setStudents] = useState<CustomStudent[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  if (courseID === '') return;
  const {data, loading} = useQuery<{studentsInCourse: Student[]}, {courseID: string}>(GET_STUDENTS_IN_COURSE, {variables: {courseID}});
  useEffect(() => {
    if (loading && !data) return;
    let arr: CustomStudent[] = [];
    data?.studentsInCourse.forEach((val) => {
      arr.push({
        id: val.id,
        email: val.email,
        fullname: `${val.name} ${val.surname}`
      });
    });
    setStudents(arr);
    setLoaded(true);
  }, [loading]);
  return [students, loaded];
};
// ================================================================================================

const GET_DASHBOARD_FLAT = gql`
  query FlatSummary($courseID: ID!) {
    flatSummary(courseID: $courseID) {
      students {
        id
        name
        surname
      }
      plos {
        id
        title
        description
      }
      los {
        id
        title
        levels {
          level
          description
        }
      }
      questions {
        title
        maxScore
        linkedPLOs
        linkedLOs
        results {
          studentID
          studentScore
        }
      }
    }
  }
`;
interface GQLFlatResponse {
  students: {
    id: string;
    name: string;
    surname: string;
  }[];
  plos: {
    id: string;
    title: string;
    description: string;
  }[];
  los: {
    id: string;
    title: string;
    levels: {
      level: number;
      description: string;
    }[];
  }[];
  questions: DashboardFlatQuestion[];
}
interface DashboardFlatQuestion {
  title: string;
  maxScore: number;
  linkedPLOs: string[];
  linkedLOs: string[];
  results: {
    studentID: string;
    studentScore: number;
  }[];
}
interface DashboardFlat {
  students: Map<string, string>; // key: studentID, val: studentName
  plos: Map<string, string>; // key: ploID, val: name
  los: Map<string, string>; // key: loID | "loID,loLevel", val: title | levelDescription
  questions: DashboardFlatQuestion[]; // all questions in a course
};
const emptyDashboardFlat: DashboardFlat = {
  students: new Map<string, string>(),
  plos: new Map<string, string>(),
  los: new Map<string, string>(),
  questions: []
};

export function useDashboardFlat(courseID: string): [DashboardFlat, boolean] {
  const [dashboard, setDashboard] = useState<DashboardFlat>(emptyDashboardFlat);
  const [loaded, setLoaded] = useState<boolean>(false);
  if (courseID === '') return;
  const {data, loading } = useQuery<{flatSummary: GQLFlatResponse}, {courseID: string}>(GET_DASHBOARD_FLAT, {variables: {courseID}});
  useEffect(() => {
    if (loading && !data) return;
    let newDashboard: DashboardFlat = {
      students: new Map<string, string>(),
      plos: new Map<string, string>(),
      los: new Map<string, string>(),
      questions: []
    };
    data?.flatSummary.students.forEach(student => newDashboard.students.set(student.id, `${student.name} ${student.surname}`));
    data?.flatSummary.plos.forEach(plo => newDashboard.plos.set(plo.id, plo.title));
    data?.flatSummary.los.forEach(lo => {
      newDashboard.los.set(lo.id, lo.title);
      lo.levels.forEach(loLevel => newDashboard.los.set(`${lo.id},${loLevel.level}`, loLevel.description));
    });
    newDashboard.questions = data?.flatSummary.questions;
    setDashboard(newDashboard);
    setLoaded(true);
  }, [loading]);
  return [dashboard, loaded];
};
// ================================================================================================

const GET_DASHBOARD_RESULT = gql`
  query QuizResults($courseID: ID!) {
    quizResults(courseID: $courseID) {
      quizName
      maxScore
      results {
        studentID
        studentName
        studentScore
      }
    }
  }
`;
interface DashboardResult {
  quizName: string;
  maxScore: number; // sum of every question's maxscore in that quiz
  results: {
    studentID: string;
    studentName: string;
    studentScore: number; // score of a student in that quiz (sum of score in every questions)
  }[];
};

export function useDashboardResult(courseID: string): [DashboardResult[], boolean] {
  const [dashboard, setDashboard] = useState<DashboardResult[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  if (courseID === '') return;
  const {data, loading} = useQuery<{quizResults: DashboardResult[]}, {courseID: string}>(GET_DASHBOARD_RESULT, {variables: {courseID}});
  useEffect(() => {
    if (loading && !data) return;
    setDashboard(data?.quizResults);
    setLoaded(true);
  }, [loading]);
  return [dashboard, loaded];
};
// ================================================================================================

const GET_DASHBOARD_PLOSUMMARY = gql`
  query PLOSummary($courseID: ID!) {
    ploSummary(courseID: $courseID) {
      ploID
      loID
    }
  }
`;
type DashboardPLOSummary = Map<string, string[]>; // key: ploID, val: a set of linked LOs to that PLO
interface GQLPLOSumaryResponse {
  ploID: string;
  loID: string[];
}

export function useDashboardPLOSummary(courseID: string): [DashboardPLOSummary, boolean] {
  const [dashboard, setDashboard] = useState<DashboardPLOSummary>(new Map<string, string[]>());
  const [loaded, setLoaded] = useState<boolean>(false);
  if (courseID === '') return;
  const {data, loading} = useQuery<{ploSummary: GQLPLOSumaryResponse[]}, {courseID: string}>(GET_DASHBOARD_PLOSUMMARY, {variables: {courseID}});
  useEffect(() => {
    if (loading && !data) return;
    let plos = new Map<string, string[]>();
    data?.ploSummary.forEach((v) => {
      plos.set(v.ploID, v.loID);
    });
    setDashboard(new Map(plos.entries()));
    setLoaded(true);
  }, [loading]);
  console.log('from helper: ', [dashboard, loaded]);
  return [dashboard, loaded];
};
