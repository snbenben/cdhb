using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections;
using System.Threading;
using System.Configuration;

namespace CDWF.Business.Helper
{
    /// <summary>
    /// һЩ���õ�SQL��������,���ݿ�ר��
    /// </summary>
    public class SqlHelper
    {
        #region ȫ�־�̬����
        //Database connection strings
        public string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["CDConnection"].ConnectionString;

        // Hashtable to store cached parameters
        private Hashtable parmCache = Hashtable.Synchronized(new Hashtable());
        #endregion

        #region ִ��SQL��䣭���䷽��
        /// <summary>
        /// Execute a SqlCommand (that returns no resultset) against the database specified in the connection string 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  int result = ExecuteNonQuery(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="connectionString">a valid connection string for a SqlConnection</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>an int representing the number of rows affected by the command</returns>
        public int ExecuteNonQuery(string connectionString, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                PrepareCommand(cmd, conn, null, cmdType, cmdText, commandParameters);
                int val = cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// Execute a SqlCommand (that returns no resultset) against an existing database connection 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  int result = ExecuteNonQuery(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="conn">an existing database connection</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>an int representing the number of rows affected by the command</returns>
        public int ExecuteNonQuery(SqlConnection connection, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();

            PrepareCommand(cmd, connection, null, cmdType, cmdText, commandParameters);
            int val = cmd.ExecuteNonQuery();
            cmd.Parameters.Clear();
            return val;
        }

        /// <summary>
        /// Execute a SqlCommand (that returns no resultset) using an existing SQL Transaction 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  int result = ExecuteNonQuery(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="trans">an existing sql transaction</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>an int representing the number of rows affected by the command</returns>
        public int ExecuteNonQuery(SqlTransaction trans, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();
            PrepareCommand(cmd, trans.Connection, trans, cmdType, cmdText, commandParameters);
            int val = cmd.ExecuteNonQuery();
            cmd.Parameters.Clear();
            return val;
        }

        /// <summary>
        /// Execute a SqlCommand that returns a resultset against the database specified in the connection string 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  SqlDataReader r = ExecuteReader(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="connectionString">a valid connection string for a SqlConnection</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>A SqlDataReader containing the results</returns>
        public SqlDataReader ExecuteReader(string connectionString, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();
            SqlConnection conn = new SqlConnection(connectionString);
            // we use a try/catch here because if the method throws an exception we want to 
            // close the connection throw code, because no datareader will exist, hence the 
            // commandBehaviour.CloseConnection will not work
            try
            {
                PrepareCommand(cmd, conn, null, cmdType, cmdText, commandParameters);
                SqlDataReader rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                cmd.Parameters.Clear();
                return rdr;
            }
            catch
            {
                conn.Close();
                throw;
            }
        }

        /// <summary>
        /// Execute a SqlCommand that returns the first column of the first record against the database specified in the connection string 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  Object obj = ExecuteScalar(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="connectionString">a valid connection string for a SqlConnection</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>An object that should be converted to the expected type using Convert.To{Type}</returns>
        public object ExecuteScalar(string connectionString, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                PrepareCommand(cmd, connection, null, cmdType, cmdText, commandParameters);
                object val = cmd.ExecuteScalar();
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// Execute a SqlCommand that returns the first column of the first record against an existing database connection 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  Object obj = ExecuteScalar(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="conn">an existing database connection</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>An object that should be converted to the expected type using Convert.To{Type}</returns>
        public object ExecuteScalar(SqlConnection connection, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();

            PrepareCommand(cmd, connection, null, cmdType, cmdText, commandParameters);
            object val = cmd.ExecuteScalar();
            cmd.Parameters.Clear();
            return val;
        }
        #endregion

        #region ���� SqlParameter
        /// <summary>
        /// add parameter array to the cache
        /// </summary>
        /// <param name="cacheKey">Key to the parameter cache</param>
        /// <param name="cmdParms">an array of SqlParamters to be cached</param>
        public void CacheParameters(string cacheKey, params SqlParameter[] commandParameters)
        {
            parmCache[cacheKey] = commandParameters;
        }

        /// <summary>
        /// Retrieve cached parameters
        /// </summary>
        /// <param name="cacheKey">key used to lookup parameters</param>
        /// <returns>Cached SqlParamters array</returns>
        public SqlParameter[] GetCachedParameters(string cacheKey)
        {
            SqlParameter[] cachedParms = (SqlParameter[])parmCache[cacheKey];

            if (cachedParms == null)
                return null;

            SqlParameter[] clonedParms = new SqlParameter[cachedParms.Length];

            for (int i = 0, j = cachedParms.Length; i < j; i++)
                clonedParms[i] = (SqlParameter)((ICloneable)cachedParms[i]).Clone();

            return clonedParms;
        }
        #endregion

        #region װ�� SqlCommand
        /// <summary>
        /// Prepare a command for execution
        /// </summary>
        /// <param name="cmd">SqlCommand object</param>
        /// <param name="conn">SqlConnection object</param>
        /// <param name="trans">SqlTransaction object</param>
        /// <param name="cmdType">Cmd type e.g. stored procedure or text</param>
        /// <param name="cmdText">Command text, e.g. Select * from Products</param>
        /// <param name="cmdParms">SqlParameters to use in the command</param>
        private void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, CommandType cmdType, string cmdText, SqlParameter[] cmdParms)
        {
            if (conn.State != ConnectionState.Open)
                conn.Open();

            cmd.Connection = conn;
            cmd.CommandText = cmdText;

            if (trans != null)
                cmd.Transaction = trans;

            cmd.CommandType = cmdType;

            if (cmdParms != null)
            {
                foreach (SqlParameter parm in cmdParms)
                    cmd.Parameters.Add(parm);
            }
        }

        /// <summary>
        /// Prepare a command for execution
        /// </summary>
        /// <param name="cmd">SqlCommand object</param>
        /// <param name="conn">SqlConnection object</param>
        /// <param name="trans">SqlTransaction object</param>
        /// <param name="cmdType">Cmd type e.g. stored procedure or text</param>
        /// <param name="cmdText">Command text, e.g. Select * from Products</param>
        /// <param name="cmdParms">SqlParameters to use in the command</param>
        private void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, CommandType cmdType, string cmdText, SqlParameter[] cmdParms, bool isOpenConn)
        {
            if (isOpenConn)
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();
            }

            cmd.Connection = conn;
            cmd.CommandText = cmdText;

            if (trans != null)
                cmd.Transaction = trans;

            cmd.CommandType = cmdType;

            if (cmdParms != null)
            {
                foreach (SqlParameter parm in cmdParms)
                    cmd.Parameters.Add(parm);
            }
        }

        /// <summary>
        /// Prepare a command for execution
        /// </summary>
        /// <param name="cmd">SqlCommand object</param>
        /// <param name="conn">SqlConnection object</param>
        /// <param name="trans">SqlTransaction object</param>
        /// <param name="cmdType">Cmd type e.g. stored procedure or text</param>
        /// <param name="cmdText">Command text, e.g. Select * from Products</param>
        /// <param name="cmdParms">SqlParameters to use in the command</param>
        private void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, CommandType cmdType, string cmdText, SqlParameter[] cmdParms, bool isOpenConn, bool isNeedReturnValue)
        {
            if (isOpenConn)
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();
            }

            cmd.Connection = conn;
            cmd.CommandText = cmdText;

            if (trans != null)
                cmd.Transaction = trans;

            cmd.CommandType = cmdType;

            if (cmdParms != null)
            {
                foreach (SqlParameter parm in cmdParms)
                    cmd.Parameters.Add(parm);
            }

            // ���뷵�ز���
            if (isNeedReturnValue)
            {
                cmd.Parameters.Add(
                    new SqlParameter("ReturnValue", SqlDbType.Int, 4,
                    ParameterDirection.ReturnValue, false, 0, 0,
                    string.Empty, DataRowVersion.Default, null));
            }
        }

        /// <summary>
        /// Prepare a command for execution
        /// </summary>
        /// <param name="cmd">SqlCommand object</param>
        /// <param name="conn">SqlConnection object</param>
        /// <param name="trans">SqlTransaction object</param>
        /// <param name="cmdType">Cmd type e.g. stored procedure or text</param>
        /// <param name="cmdText">Command text, e.g. Select * from Products</param>
        /// <param name="cmdParms">SqlParameters to use in the command</param>
        private void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, CommandType cmdType, string cmdText, SqlParameter[] cmdParms, bool isOpenConn, SqlDbType sqlDbType, int size)
        {
            if (isOpenConn)
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();
            }

            cmd.Connection = conn;
            cmd.CommandText = cmdText;

            if (trans != null)
                cmd.Transaction = trans;

            cmd.CommandType = cmdType;

            if (cmdParms != null)
            {
                foreach (SqlParameter parm in cmdParms)
                    cmd.Parameters.Add(parm);
            }

            //// ���뷵�ز���
            //if (sqlDbType != null)
            //{
            cmd.Parameters.Add(
                new SqlParameter("ReturnValue", sqlDbType, size,
                ParameterDirection.ReturnValue, false, 0, 0,
                string.Empty, DataRowVersion.Default, null));
            //}
        }
        #endregion

        #region ���ظ����ѯ������ݼ� DataSet��DataView��DataTable
        /// <summary>
        /// ����DataSet���ݼ�
        /// </summary>
        /// <param name="strSql">SQL���</param>        
        /// <returns></returns>
        public DataSet GetDataSet(string strSql)
        {
            #region
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                SqlDataAdapter da = new SqlDataAdapter(strSql, connection);
                DataSet ds = new DataSet();
                da.Fill(ds);
                return ds;
            }
            #endregion
        }

        /// <summary>
        /// ����DataSet���ݼ�
        /// </summary>
        /// <param name="strSql">SQL���</param>
        /// <param name="prams">���������SqlParameter</param>
        /// <returns></returns>
        public DataSet GetDataSet(string strSql, params SqlParameter[] prams)
        {
            #region
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                SqlCommand cmd = new SqlCommand();
                PrepareCommand(cmd, connection, null, CommandType.Text, strSql, prams, false);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                da.Fill(ds);
                return ds;
            }
            #endregion
        }

        /// <summary>
        /// ���DataSet��
        /// </summary>
        /// <param name="ds">DataSet����</param>
        /// <param name="strSql">Sql���</param>
        /// <param name="strTableName">����</param>
        public void FillDataSet(DataSet ds, string strSql, string strTableName)
        {
            #region
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                SqlDataAdapter da = new SqlDataAdapter(strSql, connection);
                da.Fill(ds, strTableName);
            }
            #endregion
        }

        /// <summary>
        /// ���DataSet��
        /// </summary>
        /// <param name="ds">DataSet����</param>
        /// <param name="strSql">Sql���</param>
        /// <param name="strTableName">����</param>
        /// <param name="prams">���������SqlParameter</param>
        public void FillDataSet(DataSet ds, string strSql, string strTableName, SqlParameter[] prams)
        {
            #region
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                SqlCommand cmd = new SqlCommand();
                PrepareCommand(cmd, connection, null, CommandType.Text, strSql, prams, false);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds, strTableName);
            }
            #endregion
        }

        /// <summary>
        /// ����DataView������ͼ
        /// </summary>
        /// <param name="strSql">Sql���</param>
        /// <returns></returns>
        public DataView GetDataView(string strSql)
        {
            #region
            return GetDataSet(strSql).Tables[0].DefaultView;
            #endregion
        }

        /// <summary>
        /// ����DataView������ͼ
        /// </summary>
        /// <param name="strSql">Sql���</param>
        /// <param name="prams">���������SqlParameter</param>
        /// <returns></returns>
        public DataView GetDataView(string strSql, SqlParameter[] prams)
        {
            #region
            return GetDataSet(strSql, prams).Tables[0].DefaultView;
            #endregion
        }

        /// <summary>
        /// ���DataTable����
        /// </summary>
        /// <param name="strSql">SQL���</param>
        /// <returns></returns>
        public DataTable GetDataTable(string strSql)
        {
            #region
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                SqlDataAdapter da = new SqlDataAdapter(strSql, connection);
                DataTable dt = new DataTable();
                da.Fill(dt);
                return dt;
            }
            #endregion
        }

        /// <summary>
        /// ���DataTable����
        /// </summary>
        /// <param name="strSql">SQL���</param>
        /// <param name="prams">���������SqlParameter</param>
        /// <returns></returns>
        public DataTable GetDataTable(string strSql, params SqlParameter[] prams)
        {
            #region
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                SqlCommand cmd = new SqlCommand();
                PrepareCommand(cmd, connection, null, CommandType.Text, strSql, prams, false);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);
                return dt;
            }
            #endregion
        }
        #endregion

        #region ִ��SQL���
        /// <summary>
        /// ִ��Sql���
        /// </summary>
        /// <param name="strSql"></param>
        public int ExecuteSql(string strSql)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, conn, null, CommandType.Text, strSql, null);
                int val = cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// ִ��Sql���
        /// </summary>
        /// <param name="strSql"></param>
        /// <param name="prams">���������SqlParameter</param>
        public int ExecuteSql(string strSql, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, conn, null, CommandType.Text, strSql, prams);
                int val = cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// ִ��Sql���
        /// </summary>
        /// <param name="strSql"></param>
        /// <param name="isNeedSqlTrans">�Ƿ���Ҫ����ע�����롢ɾ�������²����ǣ��������������Ϊtrue��</param>
        /// <param name="prams">���������SqlParameter</param>
        public int ExecuteSql(string strSql, bool isNeedSqlTrans, params SqlParameter[] prams)
        {
            if (isNeedSqlTrans)
            {
                int val;
                SqlCommand cmd = new SqlCommand();
                SqlTransaction sqlTrans = null;
                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    try
                    {
                        if (conn.State != ConnectionState.Open)
                        {
                            conn.Open();
                        }
                        sqlTrans = conn.BeginTransaction();
                        val = ExecuteNonQuery(sqlTrans, CommandType.Text, strSql, prams);
                        if (val >= 1)
                        {
                            sqlTrans.Commit();
                        }
                        return val;
                    }
                    catch
                    {
                        try
                        {
                            sqlTrans.Rollback();
                        }
                        catch
                        {
                            throw;
                        }
                        throw;
                    }
                }
            }
            else
            {
                return ExecuteSql(strSql, prams);
            }
        }

        /// <summary>
        /// Execute a SqlCommand that returns a resultset against the database specified in the connection string 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  SqlDataReader r = ExecuteReader(connString, CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="connectionString">a valid connection string for a SqlConnection</param>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>A SqlDataReader containing the results</returns>
        public SqlDataReader ExecuteSqlReader(string strSql, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();
            SqlConnection conn = new SqlConnection(ConnectionString);
            // we use a try/catch here because if the method throws an exception we want to 
            // close the connection throw code, because no datareader will exist, hence the 
            // commandBehaviour.CloseConnection will not work
            try
            {
                PrepareCommand(cmd, conn, null, CommandType.Text, strSql, prams);
                SqlDataReader sdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                cmd.Parameters.Clear();
                return sdr;
            }
            catch
            {
                conn.Close();
                throw;
            }

        }

        /// <summary>
        /// ִ��SQL��䣬�����ص�һ�е�һ�н��
        /// </summary>
        /// <param name="strSql">SQL���</param>
        /// <returns></returns>
        public object ExecuteSqlReturn(string strSql)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, conn, null, CommandType.Text, strSql, null);
                object val = cmd.ExecuteScalar();
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// ִ��SQL��䣬�����ص�һ�е�һ�н��
        /// </summary>
        /// <param name="strSql">SQL���</param>
        /// <param name="prams">���������SqlParameter</param>
        /// <returns></returns>
        public object ExecuteSqlReturn(string strSql, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, conn, null, CommandType.Text, strSql, prams);
                object val = cmd.ExecuteScalar();
                cmd.Parameters.Clear();
                return val;
            }
        }
        #endregion

        #region ִ�д洢����
        /// <summary>
        /// ִ�д洢���̣��޷���ֵ
        /// </summary>
        /// <param name="procName">�洢���̵�����</param>
        public void RunProc(string procName)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, null, true, false);
                cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
            }
        }

        /// <summary>
        /// ִ�д洢���̣��޷���ֵ
        /// </summary>
        /// <param name="procName">�洢��������</param>
        /// <param name="prams">�洢�����������</param>
        public void RunProc(string procName, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, prams, true, false);
                cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
            }
        }

        /// <summary>
        /// ִ�д洢���̣�����ѡ����ֵ�̶߳���ʱ�䣬����Ļ��ظ�ִ�ж��ٴΣ��Լ�Ĭ�Ϸ��ص�boolֵ������boolֵ
        /// </summary>
        /// <param name="procName">�洢��������</param>
        /// <param name="defaultTimeSpan">��ֵ�̶߳���ʱ��</param>
        /// <param name="defaultCount">����Ļ��ظ�ִ�ж��ٴ�</param>
        /// <param name="defaultBool">Ĭ�Ϸ��ص�boolֵ</param>
        /// <param name="prams">�洢�����������</param>
        public bool RunProc(string procName, TimeSpan defaultTimeSpan, int defaultCount, bool defaultBool, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();
            bool state = false;

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                try
                {
                    PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, prams, true, false);
                    state = RunProc(cmd, defaultTimeSpan, defaultCount, defaultBool, false, 0);
                }
                catch
                {
                    state = defaultBool;
                }
                return state;
            }
        }

        /// <summary>
        /// ִ�д洢���̣�����ѡ����ֵ�̶߳���ʱ�䣬����Ļ��ظ�ִ�ж��ٴΣ��Լ�Ĭ�Ϸ��ص�boolֵ������boolֵ
        /// </summary>
        /// <param name="cmd">SqlCommand</param>
        /// <param name="defaultTimeSpan">��ֵ�̶߳���ʱ��</param>
        /// <param name="defaultCount">����Ļ��ظ�ִ�ж��ٴ�</param>
        /// <param name="defaultBool">Ĭ�Ϸ��ص�boolֵ</param>
        /// <param name="isUseSleep">�Ƿ������߳���ֵ</param>
        /// <param name="nowCount">��ִ�ж��ٴ�</param>
        private bool RunProc(SqlCommand cmd, TimeSpan defaultTimeSpan, int defaultCount, bool defaultBool, bool isUseSleep, int nowCount)
        {
            try
            {
                if (isUseSleep)
                {
                    Thread.Sleep(defaultTimeSpan);
                }
                cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
                return true;
            }
            catch
            {
                if (nowCount < defaultCount)
                {
                    nowCount += 1;
                    return RunProc(cmd, defaultTimeSpan, defaultCount, defaultBool, true, nowCount);
                }
                else
                {
                    return defaultBool;
                }
            }
        }

        /// <summary>
        /// ִ�д洢����,����int�ͽ��
        /// </summary>
        /// <param name="procName">�洢���̵�����</param>
        /// <returns>���ش洢���̷���ֵ</returns>
        public int RunProcRetInt(string procName)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, null, true, true);
                cmd.ExecuteNonQuery();
                int val = (int)cmd.Parameters["ReturnValue"].Value;
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// ִ�д洢����,����int�ͽ��
        /// </summary>
        /// <param name="procName">�洢��������</param>
        /// <param name="prams">�洢�����������</param>
        /// <returns>���ش洢���̷���ֵ</returns>
        public int RunProcRetInt(string procName, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, prams, true, true);
                cmd.ExecuteNonQuery();
                int val = (int)cmd.Parameters["ReturnValue"].Value;
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// ִ�д洢����,����object����
        /// </summary>
        /// <param name="procName">�洢���̵�����</param>
        /// <param name="retSqlDbType">����ֵ����</param>
        /// <param name="size">����ֵ����</param>
        /// <returns>���ش洢���̷���ֵ</returns>
        public object RunProcRetObj(string procName, SqlDbType retSqlDbType, int size)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, null, true, retSqlDbType, size);
                cmd.ExecuteNonQuery();
                object val = cmd.Parameters["ReturnValue"].Value;
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// ִ�д洢����,����object����
        /// </summary>
        /// <param name="procName">�洢��������</param>
        /// <param name="retSqlDbType">����ֵ����</param>
        /// <param name="size">����ֵ����</param>
        /// <param name="prams">�洢�����������</param>
        /// <returns>���ش洢���̷���ֵ</returns>
        public object RunProcRetObj(string procName, SqlDbType retSqlDbType, int size, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, prams, true, retSqlDbType, size);
                cmd.ExecuteNonQuery();
                object val = cmd.Parameters["ReturnValue"].Value;
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// ִ�д洢����,����object����
        /// </summary>
        /// <param name="procName">�洢��������</param>
        /// <param name="parmName">Ҫ���صĲ�����</param>
        /// <param name="retSqlDbType">����ֵ����</param>
        /// <param name="size">����ֵ����</param>
        /// <param name="prams">�洢�����������</param>
        /// <returns>���ش洢���̷���ֵ</returns>
        public Object RunProcRetObj(string procName, string parmName, SqlDbType retSqlDbType, int size, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                PrepareCommand(cmd, connection, null, CommandType.StoredProcedure, procName, prams, true, retSqlDbType, size);
                cmd.ExecuteNonQuery();
                object val = cmd.Parameters[parmName].Value;
                cmd.Parameters.Clear();
                return val;
            }
        }

        /// <summary>
        /// ִ�д洢���̷���DataReader����
        /// </summary>
        /// <param name="procName">Sql���</param>
        /// <param name="prams">�洢�����������</param>
        /// <returns>DataReader</returns>
        public SqlDataReader RunProcRetDr(string procName)
        {
            SqlCommand cmd = new SqlCommand();
            SqlConnection conn = new SqlConnection(ConnectionString);
            try
            {
                PrepareCommand(cmd, conn, null, CommandType.StoredProcedure, procName, null, true, false);
                SqlDataReader rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                cmd.Parameters.Clear();
                return rdr;
            }
            catch
            {
                conn.Close();
                throw;
            }
        }

        /// <summary>
        /// ִ�д洢���̷���DataReader����
        /// </summary>
        /// <param name="procName">Sql���</param>
        /// <param name="prams">�洢�����������</param>
        /// <returns>DataReader</returns>
        public SqlDataReader RunProcRetDr(string procName, params SqlParameter[] prams)
        {
            SqlCommand cmd = new SqlCommand();
            SqlConnection conn = new SqlConnection(ConnectionString);
            try
            {
                PrepareCommand(cmd, conn, null, CommandType.StoredProcedure, procName, prams, true, false);
                SqlDataReader rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                cmd.Parameters.Clear();
                return rdr;
            }
            catch
            {
                conn.Close();
                throw;
            }
        }
        #endregion

        #region ���ɴ洢���̲�����û�м�Cache,��ʹ�÷���
        /// <summary>
        /// �����������
        /// </summary>
        /// <param name="ParamName">�洢��������</param>
        /// <param name="DbType">��������</param></param>
        /// <param name="Size">������С</param>
        /// <param name="Value">����ֵ</param>
        /// <returns>�µ� parameter ����</returns>
        public SqlParameter MyMakeInParam(string ParamName, SqlDbType DbType, int Size, object Value)
        {
            #region
            return MyMakeParam(ParamName, DbType, Size, ParameterDirection.Input, Value);

            #endregion
        }

        /// <summary>
        /// ���뷵��ֵ����
        /// </summary>
        /// <param name="ParamName">�洢��������</param>
        /// <param name="DbType">��������</param>
        /// <param name="Size">������С</param>
        /// <returns>�µ� parameter ����</returns>
        public SqlParameter MyMakeOutParam(string ParamName, SqlDbType DbType, int Size)
        {
            #region
            return MyMakeParam(ParamName, DbType, Size, ParameterDirection.Output, null);
            #endregion
        }

        /// <summary>
        /// ���ɴ洢���̲���
        /// </summary>
        /// <param name="ParamName">�洢��������</param>
        /// <param name="DbType">��������</param>
        /// <param name="Size">������С</param>
        /// <param name="Direction">��������</param>
        /// <param name="Value">����ֵ</param>
        /// <returns>�µ� parameter ����</returns>
        public SqlParameter MyMakeParam(string ParamName, SqlDbType DbType, Int32 Size, ParameterDirection Direction, object Value)
        {
            #region
            SqlParameter param;

            if (Size > 0)
                param = new SqlParameter(ParamName, DbType, Size);
            else
                param = new SqlParameter(ParamName, DbType);

            param.Direction = Direction;
            if (!(Direction == ParameterDirection.Output && Value == null))
                param.Value = Value;

            return param;
            #endregion
        }
        #endregion

        #region �����¼�����¼�¼��ID(������������int)
        /// <summary>
        /// �����¼�����¼�¼��ID(������������int)
        /// </summary>
        /// <param name="strSql"></param>
        /// <param name="parms"></param>
        /// <returns></returns>
        public int InsertReturnID(string strSqlInsert, params SqlParameter[] parms)
        {
            int id = 0;
            DataTable dt = GetDataTable(strSqlInsert + " Select @@Identity ", parms);
            if (dt != null && dt.Rows.Count > 0)
            {
                id = int.Parse(dt.Rows[0][0].ToString());
            }
            return id;
        }
        #endregion
    }
}